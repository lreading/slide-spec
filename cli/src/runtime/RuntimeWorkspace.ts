import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import { CliPackagePaths } from './CliPackagePaths'

import type { FileSystemPaths } from '../io/FileSystemPaths'

export interface PreparedRuntimeWorkspace {
  root: string
  appRoot: string
  cleanup(): Promise<void>
}

export class RuntimeWorkspace {
  public constructor(private readonly packagePaths: CliPackagePaths = new CliPackagePaths()) {}

  public async prepare(paths: FileSystemPaths): Promise<PreparedRuntimeWorkspace> {
    const workspaceRoot = resolve(
      this.packagePaths.getWorkspaceBaseRoot(),
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    )
    const templateRoot = this.packagePaths.getRuntimeTemplateRoot()

    await rm(workspaceRoot, { recursive: true, force: true })
    await mkdir(workspaceRoot, { recursive: true })
    await cp(resolve(templateRoot, 'app'), resolve(workspaceRoot, 'app'), { recursive: true })
    await cp(resolve(templateRoot, 'shared'), resolve(workspaceRoot, 'shared'), { recursive: true })
    await cp(paths.getContentRoot(), resolve(workspaceRoot, 'content'), { recursive: true })

    return {
      root: workspaceRoot,
      appRoot: resolve(workspaceRoot, 'app'),
      cleanup: async (): Promise<void> => {
        await rm(workspaceRoot, { recursive: true, force: true })
        await this.cleanupWorkspaceParent()
      },
    }
  }

  private async cleanupWorkspaceParent(): Promise<void> {
    const workspaceRoot = this.packagePaths.getWorkspaceBaseRoot()
    try {
      await rm(workspaceRoot, { recursive: false, force: false })
    } catch {
      return
    }
  }
}
