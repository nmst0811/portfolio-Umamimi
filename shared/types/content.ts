// サイトが扱うコンテンツの形。microCMS から取得した値を、server/utils/cms-map.ts でこの形に変換する。
// 画面(app/)とサーバー(server/)の両方で使うので、shared/ に置く。
// 一覧用の形(Work など)と、詳細ページ用の形(WorkDetail など)に分けている。一覧では本文を取らない。

export const workCategories = ['個人制作', '外部・依頼制作', 'その他'] as const
export type WorkCategory = (typeof workCategories)[number]

// 作品の種類。動画は動画URL(再生・埋め込み)を、プロダクト(ソフトウェアなど)は関連リンクを持つ
export const workKinds = ['動画', 'プロダクト'] as const
export type WorkKind = (typeof workKinds)[number]

export interface LinkItem {
  label: string
  href: string
}

export interface Work {
  id: string
  title: string
  kind: WorkKind
  category: WorkCategory
  date: string // YYYY-MM-DD(作品の公開日)
  platform?: string // 動画のみ。'YouTube' / 'ニコニコ動画' など
  url?: string // 動画のみ。動画のURL
  thumbnail?: string
  summary?: string // 概要(一覧に出す)
}

export interface WorkDetail extends Work {
  /** 詳細(説明・クレジットなど)。HTML */
  body: string
  /** 埋め込みプレーヤーのURL。YouTube とニコニコ動画だけ */
  embedUrl?: string
  /** 関連リンク(プロダクトの配布先・ソースなど) */
  links: LinkItem[]
}

export interface Post {
  id: string
  title: string
  /** 技術、照明、映像、イベント運営 など(microCMS の選択肢のまま)。複数選べる。1つ以上 */
  category: string[]
  kind: 'own' | 'external' // 自サイト記事 / 外部記事へのリンク
  source?: string // 外部記事の掲載先('note' など)
  url?: string // 外部記事のURL
  date: string
}

/** ブログの絞り込みの並び順。microCMS の選択肢のうち、ここにあるものを先に、あとから足したものはそのあとに並べる */
export const postCategoryOrder = ['技術', '照明', '映像', 'イベント運営', 'その他'] as const

export interface PostDetail extends Post {
  /** 本文。HTML */
  body: string
}

// 予定/終了は、開催日と今日の日付から画面側で決める(shared/utils/date.ts の eventStatus)
export interface EventItem {
  id: string
  name: string
  date: string // 開催日(複数日なら初日)。並び順と、予定/終了の判定に使う
  dateText?: string // 開催日の表記。複数日などを自由に書く(例: '2026/11/3〜11/5')
  place: string
  summary?: string // 概要(一覧に出す)
}

export interface EventDetail extends EventItem {
  /** 詳細(告知文、終了後はレポート)。HTML */
  body: string
  links: LinkItem[]
}

export interface HistoryItem {
  name: string
  /** 例: '2024/1〜現在' */
  period?: string
  /** 例: '照明' */
  role?: string
  /** 例: '終了' */
  note?: string
}

export interface Profile {
  /** 活動の始まり。1行ごとに改行して表示する */
  intro: string[]
  history: HistoryItem[]
  links: LinkItem[]
  /** 迷惑メール対策のため、@ を [at] と書いた形で持つ */
  email: string
}
