import type { PostDetail } from '../../../shared/types/content'
import { samplePostDetails } from '../../data/sample'
import { mapPostDetail, type CmsPost } from '../../utils/cms-map'
import { cached, cmsConfig, cmsDetail, sampleOrFail } from '../../utils/microcms'

// 詳細ページがあるのは、自サイト記事だけ(外部記事は、外部のURLへリンクする)
export default defineEventHandler(async (event): Promise<PostDetail> => {
  const id = getRouterParam(event, 'id') ?? ''
  const notFound = () => createError({ statusCode: 404, message: 'ページが見つかりません' })
  if (!cmsConfig(event).configured) {
    const sample = sampleOrFail(samplePostDetails).find((post) => post.id === id)
    if (!sample) throw notFound()
    return sample
  }
  const post = mapPostDetail(await cached(`posts/${id}`, () => cmsDetail<CmsPost>(event, 'posts', id)))
  if (post.kind !== 'own') throw notFound()
  return post
})
