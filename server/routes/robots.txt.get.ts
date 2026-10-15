import { siteUrl } from '../utils/site'

// すべての検索エンジンに公開する。サイトマップの場所を伝える。
export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl(event)}/sitemap.xml\n`
})
