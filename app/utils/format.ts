/** 'YYYY-MM-DD' を '2026.09.20' の表記にする */
export const formatDate = (iso: string) => iso.replaceAll('-', '.')

/** 'YYYY-MM-DD' から月と日を取り出す(タイムゾーンの影響を避けるため Date は使わない) */
export const monthDay = (iso: string) => {
  const [, m = '', d = ''] = iso.split('-')
  return { month: String(Number(m)), day: d }
}
