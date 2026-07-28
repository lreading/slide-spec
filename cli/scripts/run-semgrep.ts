import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

class SemgrepLocalRunner {
  private readonly repoRoot = resolve(process.cwd(), '..')

  public async run(): Promise<void> {
    await this.spawnDocker([
      'run',
      '--rm',
      '-v',
      `${this.repoRoot}:/src`,
      'semgrep/semgrep:1.124.0',
      'semgrep',
      'scan',
      '--config',
      'auto',
      '--config',
      '/src/.semgrep.yml',
      '--exclude-rule',
      'package_managers.dependabot.dependabot-missing-cooldown.dependabot-missing-cooldown',
      '--exclude-rule',
      'package_managers.pnpm.pnpm-missing-minimum-release-age.pnpm-minimum-release-age',
      '--error',
      '/src',
    ])
  }

  private async spawnDocker(args: string[]): Promise<void> {
    await new Promise<void>((resolvePromise, rejectPromise) => {
      const child = spawn('docker', args, {
        cwd: this.repoRoot,
        stdio: 'inherit',
      })

      child.on('error', (error) => {
        rejectPromise(error)
      })

      child.on('exit', (code, signal) => {
        if (signal) {
          rejectPromise(new Error(`Semgrep process was terminated by signal ${signal}.`))
          return
        }

        if (code !== 0) {
          rejectPromise(new Error(`Semgrep exited with code ${code}.`))
          return
        }

        resolvePromise()
      })
    })
  }
}

const runner = new SemgrepLocalRunner()

runner.run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exitCode = 1
})
