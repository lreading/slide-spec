import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { Router } from 'vue-router'

import { contentRepository } from './ContentRepository'

const getBaseTitle = (): string => contentRepository.getSiteContent().title

export const resolveDocumentTitle = (
  route: Pick<RouteLocationNormalizedLoaded, 'name' | 'params'>,
): string => {
  const site = contentRepository.getSiteContent()

  if (route.name === 'presentation' && typeof route.params.presentationId === 'string') {
    try {
      const presentation = contentRepository.getPresentation(route.params.presentationId)
      return `${presentation.presentation.title} | ${site.title}`
    } catch {
      return site.title
    }
  }

  if (route.name === 'presentations') {
    const pageTitle =
      site.presentations_page?.title?.trim()
      || site.presentations_page_title?.trim()
      || 'All presentations'
    return `${pageTitle} | ${site.title}`
  }

  return getBaseTitle()
}

export const installDocumentTitleSync = (router: Router): void => {
  router.afterEach((to) => {
    document.title = resolveDocumentTitle(to)
  })
}
