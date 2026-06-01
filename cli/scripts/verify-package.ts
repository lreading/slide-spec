import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

interface PackageManifest {
  readonly bin?: Record<string, string>
  readonly files?: string[]
}

interface PackedFile {
  readonly path: string
}

interface PackResult {
  readonly files: PackedFile[]
}

class CliPackageVerifier {
  private readonly requiredFiles = [
    'README.md',
    'package.json',
    'dist/index.js',
    'dist/runtime-template/app/index.html',
    'dist/runtime-template/app/src/main.ts',
    'dist/runtime-template/shared/src/content-validator.ts',
    'dist/examples/open-source-update/site.yaml',
    'dist/examples/product-review/site.yaml',
    'dist/examples/security-posture/site.yaml',
    'dist/examples/community-update/site.yaml',
  ]

  public async run(): Promise<void> {
    await this.verifyManifest()

    const packedFiles = await this.readPackedFilePaths()
    const missingFiles = this.requiredFiles.filter((path) => !packedFiles.has(path))
    const forbiddenFiles = [...packedFiles].filter((path) => this.isForbiddenPackedPath(path))

    if (missingFiles.length > 0 || forbiddenFiles.length > 0) {
      throw new Error(this.formatFailure(missingFiles, forbiddenFiles))
    }

    console.log(`Verified ${packedFiles.size} files in @slide-spec/cli package dry run.`)
  }

  private async verifyManifest(): Promise<void> {
    const manifest = JSON.parse(await readFile('package.json', 'utf8')) as PackageManifest

    if (manifest.bin?.['slide-spec'] !== 'dist/index.js') {
      throw new Error('package.json bin.slide-spec must point to dist/index.js.')
    }

    if (!manifest.files?.includes('dist')) {
      throw new Error('package.json files must include dist.')
    }
  }

  private async readPackedFilePaths(): Promise<Set<string>> {
    const { stdout } = await execFileAsync('pnpm', ['pack', '--json', '--dry-run', '--config.ignore-scripts=true'])
    const packResult = JSON.parse(stdout) as PackResult

    if (!Array.isArray(packResult.files)) {
      throw new Error('pnpm pack --dry-run did not return package file metadata.')
    }

    return new Set(packResult.files.map((file) => file.path))
  }

  private isForbiddenPackedPath(path: string): boolean {
    return path.includes('/node_modules/')
      || path.endsWith('.spec.ts')
      || path.includes('/coverage/')
      || path.includes('/.runtime-workspaces/')
      || path.endsWith('.eslintcache')
  }

  private formatFailure(missingFiles: string[], forbiddenFiles: string[]): string {
    const messages = ['CLI package contents are invalid.']

    if (missingFiles.length > 0) {
      messages.push(`Missing required files:\n${missingFiles.map((file) => `- ${file}`).join('\n')}`)
    }

    if (forbiddenFiles.length > 0) {
      messages.push(`Forbidden files included:\n${forbiddenFiles.map((file) => `- ${file}`).join('\n')}`)
    }

    return messages.join('\n\n')
  }
}

const verifier = new CliPackageVerifier()

verifier.run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
