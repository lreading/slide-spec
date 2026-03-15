import type { SiteContent } from '../types/content'

export interface ProjectBadgeDisplay {
  label?: string
  iconClass?: string
  iconPosition: 'before' | 'after'
}

const normalizeIconClass = (faIcon?: string): string | undefined => {
  if (!faIcon?.trim()) {
    return undefined
  }

  const trimmed = faIcon.trim()

  if (trimmed.includes(' ')) {
    return trimmed
  }

  return `fas ${trimmed}`
}

export const getProjectBadgeDisplay = (site: SiteContent): ProjectBadgeDisplay | null => {
  const label = site.project_badge?.label?.trim()
  const iconClass = normalizeIconClass(site.project_badge?.fa_icon)

  if (!label && !iconClass) {
    return null
  }

  return {
    label,
    iconClass,
    iconPosition: site.project_badge?.icon_position === 'after' ? 'after' : 'before',
  }
}
