import { resolve } from 'node:path'

export class FileSystemPaths {
  public constructor(private readonly cliRoot: string) {}

  public getCliRoot(): string {
    return this.cliRoot
  }

  public getRepoRoot(): string {
    return resolve(this.cliRoot, '..')
  }

  public getSiteConfigPath(): string {
    return resolve(this.getRepoRoot(), 'content', 'site.yaml')
  }

  public getPresentationsIndexPath(): string {
    return resolve(this.getRepoRoot(), 'content', 'presentations', 'index.yaml')
  }

  public getGeneratedPath(presentationId: string): string {
    return resolve(this.getRepoRoot(), 'content', 'presentations', presentationId, 'generated.yaml')
  }

  public getEnvPath(): string {
    return resolve(this.getCliRoot(), '.env')
  }
}
