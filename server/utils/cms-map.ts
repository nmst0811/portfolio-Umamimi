// microCMS から返る値を、サイトで使う形(shared/types/content.ts)に変換する。
// 外部に依存しない純粋な関数だけを置く(API のスキーマは SPEC.md の「4. コンテンツモデル」)。
import type {
  EventDetail,
  EventItem,
  GalleryImage,
  LinkItem,
  Post,
  PostDetail,
  Profile,
  Work,
  WorkCategory,
  WorkDetail,
  WorkKind,
} from '../../shared/types/content.ts'
import { workCategories } from '../../shared/types/content.ts'
import { toJstDate } from '../../shared/utils/date.ts'

interface CmsImage {
  url: string
  width: number
  height: number
}

// 選択フィールドは、単一選択でも配列で返ってくる
type CmsSelect = string[] | string

// 繰り返しフィールドの1件(リンク)
interface CmsLink {
  label: string
  url: string
}

export interface CmsWork {
  id: string
  title: string
  kind: CmsSelect
  category: CmsSelect
  date: string
  videoUrl?: string
  thumbnail?: CmsImage
  /** 複数画像。未設定のときは、キーがないか null */
  images?: CmsImage[] | null
  summary?: string
  body?: string
  links?: CmsLink[]
}

export interface CmsPost {
  id: string
  title: string
  category: CmsSelect
  kind: CmsSelect
  date: string
  externalUrl?: string
  body?: string
}

export interface CmsEvent {
  id: string
  name: string
  date: string
  dateText?: string
  place: string
  summary?: string
  body?: string
  /** 複数画像。未設定のときは、キーがないか null */
  images?: CmsImage[] | null
  links?: CmsLink[]
}

export interface CmsProfile {
  intro: string
  history?: { name: string; period?: string; role?: string; note?: string }[]
  links?: CmsLink[]
  email: string
}

const first = (value: CmsSelect | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

/** 複数選択のフィールドの値(空の選択肢は除く) */
const every = (value: CmsSelect | undefined) => (Array.isArray(value) ? value : [value ?? '']).filter(Boolean)

/** 必須の項目が空のとき、どのコンテンツのどの項目かを示して止める */
function required<T>(value: T | undefined | null, where: string): T {
  if (value === undefined || value === null || value === '') {
    throw new Error(`microCMS の ${where} が空です。管理画面で入力してください。`)
  }
  return value
}

/** http(s) の URL だけを通す(管理画面の入力ミスで、リンクが壊れたり別の種類になったりしないように) */
function webUrl(value: string | undefined, where: string): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href
  } catch {
    // 下で止める
  }
  throw new Error(`microCMS の ${where} が URL ではありません: ${value}`)
}

function requiredUrl(value: string | undefined, where: string) {
  return required(webUrl(value, where), where)
}

function hostOf(url: string) {
  return new URL(url).hostname.replace(/^(www|m)\./, '')
}

export function platformOf(url: string) {
  const host = hostOf(url)
  if (host === 'youtu.be' || host === 'youtube.com') return 'YouTube'
  if (host === 'nicovideo.jp' || host === 'nico.ms') return 'ニコニコ動画'
  return host
}

export function youtubeId(url: string): string | undefined {
  const u = new URL(url)
  const host = hostOf(url)
  let id: string | undefined
  if (host === 'youtu.be') id = u.pathname.split('/')[1]
  else if (host === 'youtube.com') id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1]
  return id && /^[\w-]{6,}$/.test(id) ? id : undefined
}

/** ニコニコ動画の動画ID(sm12345678 など) */
export function niconicoId(url: string): string | undefined {
  const u = new URL(url)
  const host = hostOf(url)
  let id: string | undefined
  if (host === 'nicovideo.jp') id = u.pathname.match(/^\/watch\/([^/]+)/)?.[1]
  else if (host === 'nico.ms') id = u.pathname.split('/')[1]
  return id && /^[a-z]{0,2}\d+$/.test(id) ? id : undefined
}

/** 埋め込みプレーヤーのURL。YouTube とニコニコ動画だけ。YouTube は、閲覧者の追跡を抑える nocookie のドメインを使う */
export function embedUrlOf(url: string): string | undefined {
  const youtube = youtubeId(url)
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube}`
  const niconico = niconicoId(url)
  if (niconico) return `https://embed.nicovideo.jp/watch/${niconico}`
  return undefined
}

/** 外部記事の掲載先の表示名 */
export function sourceOf(url: string) {
  const host = hostOf(url)
  const known: Record<string, string> = { 'note.com': 'note', 'zenn.dev': 'Zenn', 'qiita.com': 'Qiita' }
  return known[host] ?? host
}

/** 画像の空きを除き、同じ画像(URL が同じ)は1枚にまとめる */
function uniqueImages(images: (CmsImage | null | undefined)[]): CmsImage[] {
  const all = images.filter((image): image is CmsImage => Boolean(image?.url))
  return all.filter((image, i) => all.findIndex((other) => other.url === image.url) === i)
}

/** 作品の画像を、サムネイル、画像(複数)の順に並べる */
const imagesOf = (raw: CmsWork) => uniqueImages([raw.thumbnail, ...(raw.images ?? [])])

/** 画像の配信用の URL(幅の指定と webp への変換)。元の画像より大きくはしない */
function resized(image: CmsImage, maxWidth: number): GalleryImage {
  const scale = Math.min(1, maxWidth / image.width)
  const width = Math.round(image.width * scale)
  return { src: `${image.url}?w=${width}&fm=webp`, width, height: Math.round(image.height * scale) }
}

/**
 * 一覧のカードに出す画像。サムネイルも画像(複数)も未設定のときは、YouTube の動画なら YouTube のサムネイルを使う
 * (ニコニコ動画は、管理画面で設定する)
 */
function previewsOf(raw: CmsWork, videoUrl: string | undefined) {
  const images = imagesOf(raw)
  if (images.length) return images.map((image) => resized(image, 960).src)
  const id = videoUrl ? youtubeId(videoUrl) : undefined
  // hqdefault は上下に黒い帯が入った 4:3 の画像。16:9 の枠に object-cover で収めると、帯が切り落とされる
  return id ? [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`] : []
}

export function mapWork(raw: CmsWork): Work {
  const where = `works/${raw.id}`
  const category = first(raw.category)
  // 「プロダクト」と完全に一致したときだけプロダクト扱い。それ以外は動画
  const kind: WorkKind = first(raw.kind) === 'プロダクト' ? 'プロダクト' : '動画'
  // 動画URL は動画のときだけ使う(プロダクトでは、入っていても無視する)
  const url = kind === '動画' ? requiredUrl(raw.videoUrl, `${where} の「動画URL」`) : undefined
  return {
    id: raw.id,
    title: required(raw.title, `${where} の「タイトル」`),
    kind,
    category: (workCategories as readonly string[]).includes(category) ? (category as WorkCategory) : 'その他',
    date: toJstDate(required(raw.date, `${where} の「公開日」`)),
    platform: url ? platformOf(url) : undefined,
    url,
    previews: previewsOf(raw, url),
    summary: raw.summary?.trim() || undefined,
  }
}

export function mapWorkDetail(raw: CmsWork): WorkDetail {
  const work = mapWork(raw)
  return {
    ...work,
    body: raw.body ?? '',
    embedUrl: work.url ? embedUrlOf(work.url) : undefined,
    images: imagesOf(raw).map((image) => resized(image, 1600)),
    links: mapLinks(raw.links, `works/${raw.id} の「関連リンク」`),
  }
}

export function mapPost(raw: CmsPost): Post {
  const where = `posts/${raw.id}`
  const external = first(raw.kind) === '外部記事リンク'
  const url = external ? requiredUrl(raw.externalUrl, `${where} の「外部記事のURL」`) : undefined
  const categories = every(raw.category)
  return {
    id: raw.id,
    title: required(raw.title, `${where} の「タイトル」`),
    category: required(categories.length ? categories : undefined, `${where} の「カテゴリ」`),
    kind: external ? 'external' : 'own',
    source: url ? sourceOf(url) : undefined,
    url,
    date: toJstDate(required(raw.date, `${where} の「公開日」`)),
  }
}

export function mapPostDetail(raw: CmsPost): PostDetail {
  return { ...mapPost(raw), body: raw.body ?? '' }
}

function mapLinks(links: CmsLink[] | undefined, where: string): LinkItem[] {
  return (links ?? []).map((link) => ({
    label: required(link.label, `${where} の表示名`),
    href: requiredUrl(link.url, `${where}(${link.label})`),
  }))
}

export function mapEvent(raw: CmsEvent): EventItem {
  const where = `events/${raw.id}`
  return {
    id: raw.id,
    name: required(raw.name, `${where} の「名称」`),
    date: toJstDate(required(raw.date, `${where} の「開催日」`)),
    dateText: raw.dateText?.trim() || undefined,
    place: required(raw.place, `${where} の「場所」`),
    summary: raw.summary?.trim() || undefined,
  }
}

export function mapEventDetail(raw: CmsEvent): EventDetail {
  return {
    ...mapEvent(raw),
    body: raw.body ?? '',
    images: uniqueImages(raw.images ?? []).map((image) => resized(image, 1600)),
    links: mapLinks(raw.links, `events/${raw.id} の「関連リンク」`),
  }
}

export function mapProfile(raw: CmsProfile): Profile {
  return {
    intro: required(raw.intro, 'profile の「自己紹介」')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
    history: (raw.history ?? []).map((item) => ({
      name: required(item.name, 'profile の「参加歴」の名称'),
      period: item.period || undefined,
      role: item.role || undefined,
      note: item.note || undefined,
    })),
    links: mapLinks(raw.links, 'profile の「リンク」'),
    email: raw.email ?? '',
  }
}
