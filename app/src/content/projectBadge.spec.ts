import { describe, expect, it } from 'vitest'

import { getProjectBadgeDisplay } from './projectBadge'

describe('getProjectBadgeDisplay', () => {
  it('returns the configured generic badge metadata', () => {
    expect(
      getProjectBadgeDisplay({
        title: 'Aurora Notes Quarterly Updates',
        project_badge: {
          label: 'Demo Lab Project',
          fa_icon: 'fa-flask',
          icon_position: 'before',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        presentations_cta_label: 'View all presentations',
        links: {},
      }),
    ).toEqual({
      label: 'Demo Lab Project',
      iconClass: 'fas fa-flask',
      iconPosition: 'before',
    })
  })

  it('supports icon-only badges and normalizes default icon placement', () => {
    expect(
      getProjectBadgeDisplay({
        title: 'Aurora Notes Quarterly Updates',
        project_badge: {
          fa_icon: 'fab fa-github',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        presentations_cta_label: 'View all presentations',
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
        title: 'Aurora Notes Quarterly Updates',
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        presentations_cta_label: 'View all presentations',
        links: {},
      }),
    ).toBeNull()

    expect(
      getProjectBadgeDisplay({
        title: 'Aurora Notes Quarterly Updates',
        project_badge: {
          label: '   ',
          fa_icon: '   ',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        presentations_cta_label: 'View all presentations',
        links: {},
      }),
    ).toBeNull()
  })

  it('supports icons after the label when configured', () => {
    expect(
      getProjectBadgeDisplay({
        title: 'Aurora Notes Quarterly Updates',
        project_badge: {
          label: 'Custom Badge',
          fa_icon: 'fa-flag',
          icon_position: 'after',
        },
        home_intro: 'Quarterly community updates',
        home_cta_label: 'View latest presentation',
        presentations_cta_label: 'View all presentations',
        links: {},
      }),
    ).toEqual({
      label: 'Custom Badge',
      iconClass: 'fas fa-flag',
      iconPosition: 'after',
    })
  })
})
