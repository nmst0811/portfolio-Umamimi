import type { WorkDetail } from '../../../shared/types/content'
import { sampleWorkDetails } from '../../data/sample'
import { mapWorkDetail, type CmsWork } from '../../utils/cms-map'
import { cached, cmsConfig, cmsDetail, sampleOrFail } from '../../utils/microcms'

export default defineEventHandler(async (event): Promise<WorkDetail> => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!cmsConfig(event).configured) {
    const sample = sampleOrFail(sampleWorkDetails).find((work) => work.id === id)
    if (!sample) throw createError({ statusCode: 404, message: 'ページが見つかりません' })
    return sample
  }
  return mapWorkDetail(await cached(`works/${id}`, () => cmsDetail<CmsWork>(event, 'works', id)))
})
