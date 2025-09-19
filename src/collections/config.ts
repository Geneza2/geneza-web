import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const defaultAccessConfig = {
  create: authenticated,
  delete: authenticated,
  read: authenticatedOrPublished,
  update: authenticated,
}

export const defaultVersionsConfig = {
  drafts: {
    autosave: { interval: 100 },
    schedulePublish: true,
  },
  maxPerDoc: 50,
}

export const createAdminConfig = (_collection: string) => ({
  useAsTitle: 'title',
  defaultColumns: ['title', 'slug', 'updatedAt'],
})
