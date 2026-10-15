// microCMS が未設定のときだけ使う仮データ。実際のコンテンツではない(sampleOrFail を参照)。
import type {
  EventDetail,
  EventItem,
  Post,
  PostDetail,
  Profile,
  Work,
  WorkDetail,
} from '../../shared/types/content'

const sampleBody = `
<h2>見出し(大)</h2>
<p>これは仮の本文です。microCMS を設定すると、ここに本文が入ります。本文には<a href="https://example.com/">リンク</a>や<strong>太字</strong>も使えます。</p>
<h3>見出し(小)</h3>
<ul>
  <li>箇条書きの1つめ</li>
  <li>箇条書きの2つめ</li>
</ul>
<blockquote><p>引用の例です。</p></blockquote>
`

// YouTube の最初の動画。仮データの埋め込みとサムネイルの確認に使う
const sampleVideo = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'

export const sampleWorks: Work[] = [
  {
    id: 'w1',
    title: 'サンプル動画のタイトルがここに入ります',
    kind: '動画',
    category: '個人制作',
    date: '2026-09-20',
    platform: 'YouTube',
    url: sampleVideo,
    thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg',
    summary: 'これは仮の概要です。一覧のカードに、動画のあらすじや見どころを2〜3行で載せます。',
  },
  {
    id: 'w7',
    title: 'サンプルのプロダクト名がここに入ります',
    kind: 'プロダクト',
    category: '個人制作',
    date: '2026-09-05',
    summary: '仮の概要です。ソフトウェアなどのプロダクトは、動画URLの代わりに関連リンク(配布先やソース)を持ちます。',
  },
  { id: 'w2', title: 'サンプル動画のタイトル(依頼制作)', kind: '動画', category: '外部・依頼制作', date: '2026-08-02', platform: 'YouTube', url: 'https://www.youtube.com/', summary: '仮の概要です。' },
  { id: 'w3', title: 'サンプル動画のタイトル', kind: '動画', category: '個人制作', date: '2026-06-14', platform: 'ニコニコ動画', url: 'https://www.nicovideo.jp/watch/sm9' },
  { id: 'w4', title: 'サンプル動画のタイトル', kind: '動画', category: 'その他', date: '2026-03-28', platform: 'YouTube', url: 'https://www.youtube.com/' },
  { id: 'w5', title: 'サンプル動画のタイトル(依頼制作)', kind: '動画', category: '外部・依頼制作', date: '2025-12-07', platform: 'YouTube', url: 'https://www.youtube.com/' },
  { id: 'w6', title: 'サンプル動画のタイトル', kind: '動画', category: '個人制作', date: '2025-10-11', platform: 'YouTube', url: 'https://www.youtube.com/' },
]

export const sampleWorkDetails: WorkDetail[] = sampleWorks.map((work) => ({
  ...work,
  body: sampleBody,
  embedUrl: work.id === 'w1' ? 'https://www.youtube-nocookie.com/embed/jNQXAC9IVRw' : undefined,
  links:
    work.kind === 'プロダクト'
      ? [
          { label: 'ダウンロード(仮)', href: 'https://example.com/download' },
          { label: 'ソースコード(仮)', href: 'https://example.com/source' },
        ]
      : [],
}))

export const samplePosts: Post[] = [
  { id: 'p1', title: 'サンプル記事のタイトルがここに入ります', category: ['技術', '照明'], kind: 'own', date: '2026-10-02' },
  { id: 'p2', title: 'サンプルの外部記事のタイトル', category: ['照明'], kind: 'external', source: 'note', url: 'https://note.com/', date: '2026-08-19' },
  { id: 'p3', title: 'サンプル記事のタイトル', category: ['イベント運営'], kind: 'own', date: '2026-05-30' },
]

export const samplePostDetails: PostDetail[] = samplePosts
  .filter((post) => post.kind === 'own')
  .map((post) => ({ ...post, body: sampleBody }))

export const sampleEvents: EventItem[] = [
  { id: 'e1', name: 'サンプルイベントの名称', date: '2026-11-03', dateText: '2026/11/3〜11/5', place: '大阪', summary: 'これは仮の概要です。イベントの内容を2〜3行で載せます。' },
  { id: 'e2', name: 'サンプルイベントの名称', date: '2026-07-12', place: '東京' },
  { id: 'e3', name: 'サンプルイベントの名称', date: '2026-02-23', place: '大阪', summary: '仮の概要です。' },
]

export const sampleEventDetails: EventDetail[] = sampleEvents.map((item) => ({
  ...item,
  body: sampleBody,
  links: [
    { label: '公式サイト', href: 'https://example.com/' },
    { label: '告知の投稿', href: 'https://example.com/post' },
  ],
}))

// プロフィールは実際の内容(Foriio の記載と、ご本人に確認した内容)。microCMS の profile に入れ直すまでの控え。
export const sampleProfile: Profile = {
  intro: ['2018年からMMD動画を作っています。'],
  history: [
    { name: 'MikuIT(Miku Institute of Technology)', period: '2024/1〜現在' },
    { name: 'ボカロ紅白歌合戦', period: '2025/1〜現在' },
    { name: 'Blue Sky Tone', period: '2024/5〜2026/5' },
    { name: 'ボカダン', period: '2024/1〜2024/12' },
  ],
  links: [
    { label: 'YouTube', href: 'https://www.youtube.com/@kapibara_811' },
    { label: 'Instagram', href: 'https://www.instagram.com/kapibara_811/' },
  ],
  email: 'umamimi[at]saphir-vis.com',
}
