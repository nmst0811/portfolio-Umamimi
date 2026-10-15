import type { EventItem } from '../../shared/types/content'
import { sampleEvents } from '../data/sample'
import { mapEvent, type CmsEvent } from '../utils/cms-map'
import { cached, cmsConfig, cmsList, sampleOrFail } from '../utils/microcms'

// 一覧では、詳細(body)と関連リンクは取らない。詳細ページが events/[id] で別に取得する
export default defineEventHandler(async (event): Promise<EventItem[]> => {
  if (!cmsConfig(event).configured) return sampleOrFail(sampleEvents)
  const raw = await cached('events', () =>
    cmsList<CmsEvent>(event, 'events', { orders: '-date', fields: 'id,name,date,dateText,place,summary' }),
  )
  return raw.map(mapEvent)
})
