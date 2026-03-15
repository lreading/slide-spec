import { describe, expect, it } from 'vitest'

import { getProjectBadgeDisplay } from './projectBadge'

describe('getProjectBadgeDisplay', () => {
  it('returns the configured generic badge metadata', () => {
    expect(
      getProjectBadgeDisplay({
        title: 'Threat Dragon Quarterly Updates',
        tagline: 'making threat modeling less threatening',
        project_badge: {
          label: 'OWASP Lab Project',
          fa_icon: 'fa-flask',
          icon_position: 'before',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        archive_cta_label: 'Browse previous presentations',
        links: {},
      }),
    ).toEqual({
      label: 'OWASP Lab Project',
      iconClass: 'fas fa-flask',
      iconPosition: 'before',
    })
  })

  it('supports icon-only badges and normalizes default icon placement', () => {
    expect(
      getProjectBadgeDisplay({
        title: 'Threat Dragon Quarterly Updates',
        tagline: 'making threat modeling less threatening',
        project_badge: {
          fa_icon: 'fab fa-github',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        archive_cta_label: 'Browse previous presentations',
        links: {},
      }),
    ).toEqual({
      label: undefined,
      iconClass: 'fab fa-github',
      iconPosition: 'before',
    })
  })

  it('returns null when the badge config is missing or empty', () => {
    expect(
      getProjectBadgeDisplay({
        title: 'Threat Dragon Quarterly Updates',
        tagline: 'making threat modeling less threatening',
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        archive_cta_label: 'Browse previous presentations',
        links: {},
      }),
    ).toBeNull()

    expect(
      getProjectBadgeDisplay({
        title: 'Threat Dragon Quarterly Updates',
        tagline: 'making threat modeling less threatening',
        project_badge: {
          label: '   ',
          fa_icon: '   ',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        archive_cta_label: 'Browse previous presentations',
        links: {},
      }),
    ).toBeNull()
  })

  it('supports icons after the label when configured', () => {
    expect(
      getProjectBadgeDisplay({
        title: 'Threat Dragon Quarterly Updates',
        tagline: 'making threat modeling less threatening',
        project_badge: {
          label: 'Custom Badge',
          fa_icon: 'fa-flag',
          icon_position: 'after',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        archive_cta_label: 'Browse previous presentations',
        links: {},
      }),
    ).toEqual({
      label: 'Custom Badge',
      iconClass: 'fas fa-flag',
      iconPosition: 'after',
    })
  })
})
