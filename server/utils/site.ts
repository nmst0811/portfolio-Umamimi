// sitemap.xml / rss.xml / robots.txt で使う共通の部品。
import type { H3Event } from 'h3'

/** サイトの URL(末尾の / なし)。nuxt.config.ts の runtimeConfig.public.siteUrl */
export function siteUrl(event: H3Event) {
  return String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
}

/** XML に入れる文字列のエスケープ */
export function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
