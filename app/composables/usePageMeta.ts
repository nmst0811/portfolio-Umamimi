// ページのタイトル・説明・OGP・canonical をまとめて設定する。
// タイトルの「 | Umamimi」は app.vue の titleTemplate が付ける。OGP のタイトルには、付けた後の形を使う。
// OGP 画像は、全ページ共通の public/og.png(design/ogp/ で作っている)。
const siteName = 'Umamimi'
const defaultDescription = 'Umamimi の作品(動画・プロダクト)・ブログ・イベントのまとめサイト'

export function usePageMeta(meta: { title?: string; description?: string; type?: 'website' | 'article' } = {}) {
  const route = useRoute()
  const siteUrl = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')

  const path = route.path === '/' ? '/' : route.path.replace(/\/$/, '')
  const url = `${siteUrl}${path}`
  const title = meta.title && meta.title !== siteName ? `${meta.title} | ${siteName}` : siteName
  const description = meta.description?.trim() || defaultDescription

  useSeoMeta({
    title: meta.title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: meta.type ?? 'website',
    ogUrl: url,
    ogSiteName: siteName,
    ogLocale: 'ja_JP',
    ogImage: `${siteUrl}/og.png`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'Umamimi のオリジナルキャラクターと、サイトのロゴ',
    twitterCard: 'summary_large_image',
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
