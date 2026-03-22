import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

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
}
