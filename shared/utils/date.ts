// 日付はすべて日本時間(JST)の 'YYYY-MM-DD' で扱う。
// ビルドは UTC のサーバーで動くことがあり、そのまま Date を使うと日付が前後するため。

const JST_OFFSET_MS = 9 * 60 * 60 * 1000

/** ISO 8601 の日時(microCMS の日付)を、日本時間の 'YYYY-MM-DD' にする */
export const toJstDate = (iso: string) =>
  new Date(new Date(iso).getTime() + JST_OFFSET_MS).toISOString().slice(0, 10)

/** 今日の日付(日本時間) */
export const todayInJst = () => toJstDate(new Date().toISOString())

export type EventStatus = '予定' | '終了'

/** 開催日が今日以降なら「予定」、過ぎていれば「終了」 */
export const eventStatus = (date: string, today: string): EventStatus => (date >= today ? '予定' : '終了')
