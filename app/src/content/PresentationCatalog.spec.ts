import { describe, expect, it } from 'vitest'

import { PresentationCatalog } from './PresentationCatalog'

const entries = [
  {
    id: '2026-q4',
    year: 2026,
    title: 'Q4 2026 Update',
    subtitle: 'Q4 2026',
    summary: 'Late-year update',
    presentation_path: 'presentations/2026-q4/presentation.yaml',
    published: true,
    featured: false,
  },
  {
    id: '2026-q3',
    year: 2026,
    title: 'Q3 2026 Update',
    subtitle: 'Q3 2026',
    summary: 'Summer update',
    presentation_path: 'presentations/2026-q3/presentation.yaml',
    published: true,
    featured: false,
  },
  {
    id: '2025-q4',
    year: 2025,
    title: 'Q4 2025 Update',
    subtitle: 'Q4 2025',
    summary: 'Holiday update',
    presentation_path: 'presentations/2025-q4/presentation.yaml',
    published: true,
    featured: false,
  },
  {
    id: '2025-q3',
    year: 2025,
    title: 'Security Weekly',
    subtitle: 'Q3 2025',
    summary: 'Weekly cadence presentations test',
    presentation_path: 'presentations/2025-q3/presentation.yaml',
    published: true,
    featured: false,
  },
]

describe('PresentationCatalog', () => {
  it('lists distinct years in descending order', () => {
    const catalog = new PresentationCatalog(entries)

    expect(catalog.listYears()).toEqual([2026, 2025])
  })

  it('filters by year and search text', () => {
    const catalog = new PresentationCatalog(entries)

    expect(
      catalog.getPage({
        page: 1,
        pageSize: 10,
        search: 'weekly',
        year: 2025,
      }).items.map((entry) => entry.id),
    ).toEqual(['2025-q3'])
  })

  it('paginates and clamps out-of-range page numbers', () => {
    const catalog = new PresentationCatalog(entries)

    const page = catalog.getPage({
      page: 99,
      pageSize: 3,
      search: '',
      year: null,
    })

    expect(page.page).toBe(2)
    expect(page.totalPages).toBe(2)
    expect(page.startItem).toBe(4)
    expect(page.endItem).toBe(4)
    expect(page.items.map((entry) => entry.id)).toEqual(['2025-q3'])
  })
})
