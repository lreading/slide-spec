import { describe, expect, it } from 'vitest'

import { assetResolver, normalizeAssetPath, selectAssetModules } from './AssetResolver'

describe('AssetResolver', () => {
  it('selects fixture asset modules only when fixture mode is enabled', () => {
    expect(selectAssetModules(undefined, { live: true }, { fixture: true }, { demo: true }, { docs: true })).toEqual({
      live: true,
    })
    expect(selectAssetModules('fixtures', { live: true }, { fixture: true }, { demo: true }, { docs: true })).toEqual({
      fixture: true,
    })
    expect(selectAssetModules('demo', { live: true }, { fixture: true }, { demo: true }, { docs: true })).toEqual({
      demo: true,
    })
    expect(selectAssetModules('docs-reference', { live: true }, { fixture: true }, { demo: true }, { docs: true })).toEqual({
      docs: true,
    })
  })

  it('normalizes live, fixture, and demo asset paths', () => {
    expect(normalizeAssetPath('../../../content/assets/logo.svg')).toBe('content/assets/logo.svg')
    expect(normalizeAssetPath('../../e2e/fixtures/content/assets/logo.svg')).toBe('content/assets/logo.svg')
    expect(normalizeAssetPath('../../e2e/fixtures/content-demo/assets/logo.png')).toBe('content/assets/logo.png')
    expect(normalizeAssetPath('../../../docs/fixtures/reference-project/content/assets/logo.svg')).toBe(
      'content/assets/logo.svg',
    )
  })

  it('resolves project asset paths to bundled asset URLs', () => {
    expect(assetResolver.resolve('content/assets/cupcake-logo.png')).toContain('cupcake-logo')
    expect(assetResolver.resolve('assets/cupcake-mascot.png')).toContain('cupcake-mascot')
  })

  it('passes through remote and absolute URLs unchanged', () => {
    expect(assetResolver.resolve('https://example.com/logo.png')).toBe('https://example.com/logo.png')
    expect(assetResolver.resolve('/logo.png')).toBe('/logo.png')
  })

  it('returns undefined for blank values', () => {
    expect(assetResolver.resolve('   ')).toBeUndefined()
    expect(assetResolver.resolve(undefined)).toBeUndefined()
  })
})
