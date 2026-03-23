import { resolve } from 'node:path'

export class FileSystemPaths {
  public constructor(private readonly projectRoot: string) {}

  public getProjectRoot(): string {
    return this.projectRoot
  }

  public getAppRoot(): string {
    return resolve(this.getProjectRoot(), 'app')
  }

  public getContentRoot(): string {
    return resolve(this.getProjectRoot(), 'content')
  }

  public getDistPath(): string {
    return resolve(this.getProjectRoot(), 'dist')
  }

  public getSiteConfigPath(): string {
    return resolve(this.getProjectRoot(), 'content', 'site.yaml')
  }

  public getPresentationsIndexPath(): string {
    return resolve(this.getProjectRoot(), 'content', 'presentations', 'index.yaml')
  }

  public getGeneratedPath(presentationId: string): string {
    return resolve(this.getProjectRoot(), 'content', 'presentations', presentationId, 'generated.yaml')
  }

  public getPresentationPath(presentationId: string): string {
    return resolve(this.getProjectRoot(), 'content', 'presentations', presentationId, 'presentation.yaml')
  }

  public getEnvPath(): string {
    return resolve(this.getProjectRoot(), '.env')
  }

  public getLegacyMonorepoEnvPath(): string {
    return resolve(this.getProjectRoot(), 'cli', '.env')
  }

  public getCliWorkspaceRoot(): string {
    return resolve(this.getProjectRoot(), '.slide-spec')
  }
}
