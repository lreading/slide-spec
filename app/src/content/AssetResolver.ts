export const selectAssetModules = (
  source: string | undefined,
  liveModules: Record<string, unknown>,
  fixtureModules: Record<string, unknown>,
  demoModules: Record<string, unknown>,
  docsReferenceModules: Record<string, unknown>,
): Record<string, unknown> => {
  if (source === 'fixtures') {
    return fixtureModules
  }
  if (source === 'demo') {
    return demoModules
  }
  if (source === 'docs-reference') {
    return docsReferenceModules
  }
  return liveModules
}

export const normalizeAssetPath = (path: string): string =>
  path
    .replace(/^(\.\.\/)+e2e\/fixtures\/content-demo\/assets\//, 'content/assets/')
    .replace(/^(\.\.\/)+docs\/fixtures\/reference-project\/content\//, 'content/')
    .replace(/^(\.\.\/)+(e2e\/fixtures\/)?content\//, 'content/')

const liveAssetModules = import.meta.glob('../../../content/assets/**/*.{png,jpg,jpeg,svg,webp,avif,gif,ico}', {
  eager: true,
  import: 'default',
})
const fixtureAssetModules = import.meta.glob('../../e2e/fixtures/content/assets/**/*.{png,jpg,jpeg,svg,webp,avif,gif,ico}', {
  eager: true,
  import: 'default',
})
const demoAssetModules = import.meta.glob('../../e2e/fixtures/content-demo/assets/**/*.{png,jpg,jpeg,svg,webp,avif,gif,ico}', {
  eager: true,
  import: 'default',
})
const docsReferenceAssetModules = import.meta.glob(
  '../../../docs/fixtures/reference-project/content/assets/**/*.{png,jpg,jpeg,svg,webp,avif,gif,ico}',
  {
    eager: true,
    import: 'default',
  },
)
const assetModules = selectAssetModules(
  import.meta.env.VITE_CONTENT_SOURCE,
  liveAssetModules,
  fixtureAssetModules,
  demoAssetModules,
  docsReferenceAssetModules,
)

const assetLookup = new Map<string, string>(
  Object.entries(assetModules).flatMap(([path, source]) => {
    const normalized = normalizeAssetPath(path)
    return [
      [normalized, String(source)],
      [normalized.replace(/^content\//, ''), String(source)],
    ]
  }),
)

export class AssetResolver {
  public resolve(url: string | undefined): string | undefined {
    const trimmed = url?.trim()
    if (!trimmed) {
      return undefined
    }

    if (trimmed.startsWith('/')) {
      return trimmed
    }

    if (this.isRemoteUrl(trimmed)) {
      return trimmed
    }

    return assetLookup.get(trimmed) ?? trimmed
  }

  private isRemoteUrl(value: string): boolean {
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }
}

export const assetResolver = new AssetResolver()
