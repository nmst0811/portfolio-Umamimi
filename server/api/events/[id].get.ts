import type { EventDetail } from '../../../shared/types/content'
import { sampleEventDetails } from '../../data/sample'
import { mapEventDetail, type CmsEvent } from '../../utils/cms-map'
import { cached, cmsConfig, cmsDetail, sampleOrFail } from '../../utils/microcms'

export default defineEventHandler(async (event): Promise<EventDetail> => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!cmsConfig(event).configured) {
    const sample = sampleOrFail(sampleEventDetails).find((item) => item.id === id)
    if (!sample) throw createError({ statusCode: 404, message: 'ページが見つかりません' })
    return sample
  }
  return mapEventDetail(await cached(`events/${id}`, () => cmsDetail<CmsEvent>(event, 'events', id)))
})
