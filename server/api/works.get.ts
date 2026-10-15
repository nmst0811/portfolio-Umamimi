import type { Work } from '../../shared/types/content'
import { sampleWorks } from '../data/sample'
import { mapWork, type CmsWork } from '../utils/cms-map'
import { cached, cmsConfig, cmsList, sampleOrFail } from '../utils/microcms'

// 一覧では、詳細(body)と関連リンクは取らない。詳細ページが works/[id] で別に取得する
export default defineEventHandler(async (event): Promise<Work[]> => {
  if (!cmsConfig(event).configured) return sampleOrFail(sampleWorks)
  const raw = await cached('works', () =>
    cmsList<CmsWork>(event, 'works', { orders: '-date', fields: 'id,title,kind,category,date,videoUrl,thumbnail,summary' }),
  )
  return raw.map(mapWork)
})
