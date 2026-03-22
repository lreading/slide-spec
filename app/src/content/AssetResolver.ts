export const selectAssetModules = (
  source: string | undefined,
  liveModules: Record<string, unknown>,
  fixtureModules: Record<string, unknown>,
): Record<string, unknown> => (source === 'fixtures' ? fixtureModules : liveModules)

export const normalizeAssetPath = (path: string): string =>
  path.replace(/^(\.\.\/)+(e2e\/fixtures\/)?content\//, 'content/')

const liveAssetModules = import.meta.glob('../../../content/assets/**/*.{png,jpg,jpeg,svg,webp,avif,gif,ico}', {
  eager: true,
  import: 'default',
})
const fixtureAssetModules = import.meta.glob('../../e2e/fixtures/content/assets/**/*.{png,jpg,jpeg,svg,webp,avif,gif,ico}', {
  eager: true,
  import: 'default',
})
const assetModules = selectAssetModules(import.meta.env.VITE_CONTENT_SOURCE, liveAssetModules, fixtureAssetModules)

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
