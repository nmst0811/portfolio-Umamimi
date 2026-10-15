// RSS 2.0。作品とブログの新着(公開日の新しい順に 30 件)。
// イベントは入れない。RSS の項目には公開日が要るが、イベントが持つのは開催日(未来になりうる)だけのため。
import type { Post, Work } from '../../shared/types/content'
import { siteUrl, xmlEscape } from '../utils/site'

const MAX_ITEMS = 30

interface Item {
  title: string
  link: string
  date: string // YYYY-MM-DD(日本時間)
  description: string
  categories: string[]
}

// 日付だけを持つので、日本時間の 0 時として扱う(RSS の日付は RFC 822 の形)
const rfc822 = (date: string) => new Date(`${date}T00:00:00+09:00`).toUTCString()

export default defineEventHandler(async (event) => {
  const base = siteUrl(event)
  const [works, posts] = await Promise.all([$fetch<Work[]>('/api/works'), $fetch<Post[]>('/api/posts')])

  const items: Item[] = [
    ...works.map((work) => ({
      title: work.title,
      link: `${base}/works/${work.id}`,
      date: work.date,
      description: work.summary ?? `${work.kind}(${work.category})`,
      categories: [work.kind, work.category],
    })),
    ...posts.map((post) => ({
      title: post.title,
      // 外部記事は、サイトの方針(一覧と同じ)に合わせて、外部の URL へリンクする
      link: post.kind === 'external' && post.url ? post.url : `${base}/blog/${post.id}`,
      date: post.date,
      description: post.kind === 'external' ? `${post.source}の記事` : `ブログ(${post.category.join('、')})`,
      categories: ['ブログ', ...post.category],
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_ITEMS)

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>Umamimi</title>',
    `    <link>${xmlEscape(base)}/</link>`,
    '    <description>Umamimi の作品とブログの新着</description>',
    '    <language>ja</language>',
    `    <atom:link href="${xmlEscape(base)}/rss.xml" rel="self" type="application/rss+xml" />`,
    // ビルドのたびに変わる時刻ではなく、いちばん新しい項目の日付にする(内容が同じなら出力も同じになる)
    ...(items[0] ? [`    <lastBuildDate>${rfc822(items[0].date)}</lastBuildDate>`] : []),
    ...items.flatMap((item) => [
      '    <item>',
      `      <title>${xmlEscape(item.title)}</title>`,
      `      <link>${xmlEscape(item.link)}</link>`,
      `      <guid isPermaLink="true">${xmlEscape(item.link)}</guid>`,
      `      <pubDate>${rfc822(item.date)}</pubDate>`,
      `      <description>${xmlEscape(item.description)}</description>`,
      ...item.categories.map((category) => `      <category>${xmlEscape(category)}</category>`),
      '    </item>',
    ]),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
})
