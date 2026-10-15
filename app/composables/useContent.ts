// microCMS のコンテンツを取得する(server/api/ を経由する)。
// 静的サイトにするときは、ビルド中に取得して各ページに埋め込まれる。ブラウザからは microCMS を呼ばない。
import type { Ref } from 'vue'
import type { EventDetail, EventItem, Post, PostDetail, Profile, Work, WorkDetail } from '#shared/types/content'
import { eventStatus, todayInJst } from '#shared/utils/date'

/** サーバー側のエラーの理由(microCMS が未設定、必須の項目が空、など)。ビルドのログに出す */
const reasonOf = (error: { data?: { message?: string }; message?: string }) => error.data?.message ?? error.message ?? ''

async function load<T>(url: string, fallback: () => T) {
  const { data, error } = await useFetch<T>(url, { default: fallback })
  // 取得に失敗したまま、空のサイトを公開してしまわないよう、ビルドを止める
  if (error.value) {
    throw createError({ statusCode: 500, message: `${url} を取得できませんでした: ${reasonOf(error.value)}`, fatal: true })
  }
  return data as Ref<T>
}

/** 詳細ページ用。見つからなければ 404 のページを出す */
async function loadDetail<T>(url: string) {
  const { data, error } = await useFetch<T>(url)
  if (error.value || !data.value) {
    const notFound = !error.value || error.value.statusCode === 404
    throw createError({
      statusCode: notFound ? 404 : 500,
      message: notFound ? 'ページが見つかりません' : `${url} を取得できませんでした: ${reasonOf(error.value!)}`,
      fatal: true,
    })
  }
  return data as Ref<T>
}

export const useWorks = () => load<Work[]>('/api/works', () => [])

export const useWorkDetail = (id: string) => loadDetail<WorkDetail>(`/api/works/${encodeURIComponent(id)}`)

export const usePosts = () => load<Post[]>('/api/posts', () => [])

export const usePostDetail = (id: string) => loadDetail<PostDetail>(`/api/posts/${encodeURIComponent(id)}`)

export const useEventDetail = (id: string) => loadDetail<EventDetail>(`/api/events/${encodeURIComponent(id)}`)

export const useProfile = () =>
  load<Profile>('/api/profile', () => ({ intro: [], history: [], links: [], email: '' }))

/**
 * 今日の日付(日本時間)。
 * ビルド時の日付で描画し、ブラウザで開いたあとに本当の今日へ更新する。
 * (静的サイトはビルド後に日付が進んでも、予定/終了の表示が古いままになってしまうため)
 */
export function useToday() {
  const today = useState('today', () => todayInJst())
  onMounted(() => {
    today.value = todayInJst()
  })
  return today
}

/** イベントを、開催予定(近い順)と終了(新しい順)に分ける */
export async function useEvents() {
  // await のあとでは、Nuxt の文脈が失われて useToday(useState / onMounted)が使えない。先に呼ぶ
  const today = useToday()
  const events = await load<EventItem[]>('/api/events', () => [])
  const upcoming = computed(() =>
    events.value.filter((e) => eventStatus(e.date, today.value) === '予定').sort((a, b) => a.date.localeCompare(b.date)),
  )
  const past = computed(() =>
    events.value.filter((e) => eventStatus(e.date, today.value) === '終了').sort((a, b) => b.date.localeCompare(a.date)),
  )
  return { upcoming, past }
}
