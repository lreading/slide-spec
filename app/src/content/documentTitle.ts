import { watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { Router } from 'vue-router'

import { contentRepository, contentVersion } from './ContentRepository'
import { resolvePresentationsPageContent } from './contentDefaults'

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
    const pageTitle = resolvePresentationsPageContent(site).title
    return pageTitle ? `${pageTitle} | ${site.title}` : site.title
  }

  return getBaseTitle()
}

export const installDocumentTitleSync = (router: Router): void => {
  const sync = (route: Pick<RouteLocationNormalizedLoaded, 'name' | 'params'>): void => {
    document.title = resolveDocumentTitle(route)
  }

  router.afterEach((to) => {
    sync(to)
  })
  watch(contentVersion, () => {
    const currentRoute = router.currentRoute?.value

    if (currentRoute) {
      sync(currentRoute)
    }
  })
  const currentRoute = router.currentRoute?.value

  if (currentRoute) {
    sync(currentRoute)
  }
}
