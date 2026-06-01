import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, dirname, resolve } from 'node:path'

export class CliPackagePaths {
  private readonly packageRoot: string

  public constructor(packageRoot?: string) {
    this.packageRoot = packageRoot ?? this.findPackageRoot()
  }

  public getPackageRoot(): string {
    return this.packageRoot
  }

  public getNodeModulesRoot(): string {
    return resolve(this.packageRoot, 'node_modules')
  }

  public getNodeModulesRoots(): string[] {
    return [
      this.getNodeModulesRoot(),
      this.findPackageManagerNodeModulesRoot(),
    ].filter((path, index, paths): path is string => Boolean(path) && paths.indexOf(path) === index)
  }

  public getWorkspaceBaseRoot(): string {
    return resolve(this.packageRoot, '.runtime-workspaces')
  }

  public getRuntimeTemplateRoot(): string {
    const candidates = [
      resolve(this.packageRoot, 'dist', 'runtime-template'),
      resolve(this.packageRoot, 'runtime-template'),
    ]
    const runtimeTemplateRoot = candidates.find((candidate) => existsSync(candidate))

    if (!runtimeTemplateRoot) {
      throw new Error('Missing embedded runtime template. Rebuild the CLI package before using build or serve.')
    }

    return runtimeTemplateRoot
  }

  public getExamplesRoot(): string {
    const candidates = [
      resolve(this.packageRoot, 'dist', 'examples'),
      resolve(this.packageRoot, 'examples-synced'),
    ]
    const examplesRoot = candidates.find((candidate) => existsSync(candidate))

    if (!examplesRoot) {
      throw new Error('Missing bundled examples. Rebuild the CLI package before using --from-example.')
    }

    return examplesRoot
  }

  private findPackageRoot(): string {
    const searchStart = dirname(fileURLToPath(import.meta.url))
    const candidates = [
      searchStart,
      resolve(searchStart, '..'),
      resolve(searchStart, '..', '..'),
      resolve(searchStart, '..', '..', '..'),
    ]
    const packageRoot = candidates.find((candidate) => existsSync(resolve(candidate, 'package.json')))

    if (!packageRoot) {
      throw new Error('Unable to resolve the CLI package root.')
    }

    return packageRoot
  }

  private findPackageManagerNodeModulesRoot(): string | undefined {
    let current = this.packageRoot

    while (current !== dirname(current)) {
      if (basename(current) === 'node_modules') {
        return current
      }

      current = dirname(current)
    }

    return undefined
  }
}
