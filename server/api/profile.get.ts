import type { Profile } from '../../shared/types/content'
import { sampleProfile } from '../data/sample'
import { mapProfile, type CmsProfile } from '../utils/cms-map'
import { cached, cmsConfig, cmsObject, sampleOrFail } from '../utils/microcms'

export default defineEventHandler(async (event): Promise<Profile> => {
  if (!cmsConfig(event).configured) return sampleOrFail(sampleProfile)
  const raw = await cached('profile', () => cmsObject<CmsProfile>(event, 'profile'))
  return mapProfile(raw)
})
