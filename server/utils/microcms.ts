// microCMS の Content API を呼ぶ。サーバーだけで動き、API キーはブラウザに出ない。
// 静的サイトにするとき(nuxt generate)は、ビルド中にここで取得した内容が各ページに埋め込まれる。
import type { H3Event } from 'h3'

interface ListResponse<T> {
  contents: T[]
  totalCount: number
}

const LIMIT = 100 // 1回の取得で返せる上限
const memo = new Map<string, Promise<unknown>>()
let warnedSample = false

export function cmsConfig(event: H3Event) {
  const config = useRuntimeConfig(event)
  // 'xxxx' でも 'xxxx.microcms.io' でも、'https://xxxx.microcms.io/' でも受け付ける
  const domain = String(config.microcmsServiceDomain)
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\.microcms\.io.*$/, '')
  const apiKey = String(config.microcmsApiKey).trim()
  return { domain, apiKey, configured: Boolean(domain && apiKey) }
}

function request<T>(event: H3Event, endpoint: string, query: Record<string, string | number> = {}) {
  const { domain, apiKey } = cmsConfig(event)
  if (!/^[a-z0-9-]+$/i.test(domain)) {
    throw createError({ statusCode: 500, message: `MICROCMS_SERVICE_DOMAIN の値が正しくありません: ${domain}` })
  }
  return $fetch<T>(`https://${domain}.microcms.io/api/v1/${endpoint}`, {
    headers: { 'X-MICROCMS-API-KEY': apiKey },
    query,
    retry: 2,
    retryDelay: 500,
  })
}

/** リスト形式の API から、全件を取得する */
export async function cmsList<T>(event: H3Event, endpoint: string, query: Record<string, string | number> = {}) {
  const all: T[] = []
  for (let offset = 0; ; offset += LIMIT) {
    const page = await request<ListResponse<T>>(event, endpoint, { ...query, limit: LIMIT, offset })
    all.push(...page.contents)
    if (page.contents.length === 0 || all.length >= page.totalCount) return all
  }
}

/** リスト形式の API から、1件を取得する。見つからないときは 404 */
export async function cmsDetail<T>(event: H3Event, endpoint: string, id: string) {
  // コンテンツID だけを通す(URL の組み立てに、余計な文字が入らないように)
  if (!/^[\w-]+$/.test(id)) throw createError({ statusCode: 404, message: 'ページが見つかりません' })
  try {
    return await request<T>(event, `${endpoint}/${id}`)
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode
    if (status === 404) throw createError({ statusCode: 404, message: 'ページが見つかりません' })
    throw error
  }
}

/** オブジェクト形式の API を取得する */
export function cmsObject<T>(event: H3Event, endpoint: string) {
  return request<T>(event, endpoint)
}

/** ビルド中は、同じ API を何度も呼ばないよう結果を使い回す(開発中は、編集をすぐ反映するため使い回さない) */
export function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (import.meta.dev) return load()
  let hit = memo.get(key) as Promise<T> | undefined
  if (!hit) {
    hit = load()
    memo.set(key, hit)
    hit.catch(() => memo.delete(key))
  }
  return hit
}

/**
 * microCMS が未設定のときの扱い。
 * 開発中は仮データで画面を確認できるようにする。公開用のビルドでは、仮データを公開してしまわないよう止める
 * (仮データでビルドを確かめたいときは、環境変数 MICROCMS_USE_SAMPLE=1 を付ける)。
 */
export function sampleOrFail<T>(sample: T): T {
  if (import.meta.dev || process.env.MICROCMS_USE_SAMPLE === '1') {
    if (!warnedSample) {
      warnedSample = true
      console.warn('[microCMS] MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定のため、仮データを表示しています。')
    }
    return sample
  }
  throw createError({
    statusCode: 500,
    message: 'microCMS が未設定です。MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を設定してください。',
  })
}
