import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

class RuntimeTemplateSync {
  private readonly repoRoot = resolve(import.meta.dirname, '..', '..')
  private readonly cliRoot = resolve(this.repoRoot, 'cli')
  private readonly appRoot = resolve(this.repoRoot, 'app')
  private readonly sharedRoot = resolve(this.repoRoot, 'shared')

  public async run(): Promise<void> {
    const outputRoot = this.readOutputRoot()

    await rm(outputRoot, { recursive: true, force: true })
    await mkdir(outputRoot, { recursive: true })
    await this.copyApp(outputRoot)
    await this.copyShared(outputRoot)
  }

  private readOutputRoot(): string {
    const outFlagIndex = process.argv.findIndex((arg) => arg === '--out')
    const relativeOutput = outFlagIndex >= 0 ? process.argv[outFlagIndex + 1] : undefined

    if (!relativeOutput) {
      throw new Error('Missing required --out <path> argument.')
    }

    return resolve(this.cliRoot, relativeOutput)
  }

  private async copyApp(outputRoot: string): Promise<void> {
    const appOutputRoot = resolve(outputRoot, 'app')
    const rootFiles = [
      'index.html',
      'postcss.config.cjs',
      'tailwind.config.cjs',
    ]

    await mkdir(appOutputRoot, { recursive: true })

    for (const file of rootFiles) {
      await cp(resolve(this.appRoot, file), resolve(appOutputRoot, file))
    }

    await cp(resolve(this.appRoot, 'public'), resolve(appOutputRoot, 'public'), {
      recursive: true,
    })
    await cp(resolve(this.appRoot, 'src'), resolve(appOutputRoot, 'src'), {
      recursive: true,
      filter: (sourcePath) => {
        const normalizedPath = sourcePath.replaceAll('\\', '/')
        return !normalizedPath.endsWith('.spec.ts') && !normalizedPath.includes('/test/')
      },
    })
  }

  private async copyShared(outputRoot: string): Promise<void> {
    await cp(this.sharedRoot, resolve(outputRoot, 'shared'), {
      recursive: true,
    })
  }
}

const sync = new RuntimeTemplateSync()

sync.run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
