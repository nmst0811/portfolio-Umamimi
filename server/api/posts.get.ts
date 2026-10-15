import type { Post } from '../../shared/types/content'
import { samplePosts } from '../data/sample'
import { mapPost, type CmsPost } from '../utils/cms-map'
import { cached, cmsConfig, cmsList, sampleOrFail } from '../utils/microcms'

// 一覧では、本文(body)は取らない。詳細ページが posts/[id] で別に取得する
export default defineEventHandler(async (event): Promise<Post[]> => {
  if (!cmsConfig(event).configured) return sampleOrFail(samplePosts)
  const raw = await cached('posts', () =>
    cmsList<CmsPost>(event, 'posts', { orders: '-date', fields: 'id,title,category,kind,date,externalUrl' }),
  )
  return raw.map(mapPost)
})
