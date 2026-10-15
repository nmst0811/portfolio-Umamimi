// サイトマップ。ビルド時に、全ページの URL を書き出す(nuxt.config.ts の nitro.prerender.routes)。
// 一覧は /api/ から取る。microCMS が未設定のときの仮データの扱いも、そちらに任せる。
import type { EventItem, Post, Work } from '../../shared/types/content'
import { siteUrl, xmlEscape } from '../utils/site'

export default defineEventHandler(async (event) => {
  const base = siteUrl(event)
  const [works, posts, events] = await Promise.all([
    $fetch<Work[]>('/api/works'),
    $fetch<Post[]>('/api/posts'),
    $fetch<EventItem[]>('/api/events'),
  ])

  const paths = [
    '/',
    '/works',
    '/blog',
    '/events',
    '/profile',
    '/privacy',
    ...works.map((work) => `/works/${work.id}`),
    // 外部記事には、サイト内のページがない
    ...posts.filter((post) => post.kind === 'own').map((post) => `/blog/${post.id}`),
    ...events.map((item) => `/events/${item.id}`),
  ]

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${xmlEscape(base + path)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n')
})
