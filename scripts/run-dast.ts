import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'

function run(command: string, args: readonly string[], env: NodeJS.ProcessEnv = {}): void {
  const result = spawnSync(command, args, {
    env: { ...process.env, ...env },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run(
  'pnpm',
  ['--filter', '@slide-spec/app', 'build'],
  {
    SLIDE_SPEC_DEPLOYMENT_URL: 'http://127.0.0.1:4173',
    SLIDE_SPEC_SITEMAP_ENABLED: 'true',
  },
)

const server = spawn('pnpm', ['exec', 'http-server', './app/dist', '-p', '4173'], {
  stdio: 'ignore',
  shell: process.platform === 'win32',
})

const stopServer = (): void => {
  server.kill()
}

process.on('exit', stopServer)
process.on('SIGINT', () => {
  stopServer()
  process.exit(130)
})

await new Promise((resolve) => setTimeout(resolve, 2000))

mkdirSync('dast-report', { recursive: true })

run('docker', [
  'run',
  '--rm',
  '--network',
  'host',
  '--user',
  'root',
  '-v',
  `${process.cwd()}/.github:/zap/config:ro`,
  '-v',
  `${process.cwd()}/dast-report:/zap/wrk:rw`,
  'ghcr.io/zaproxy/zaproxy:stable',
  'zap-baseline.py',
  '-t',
  'http://127.0.0.1:4173',
  '-c',
  '/zap/config/zap-baseline.conf',
  '-J',
  'zap-report.json',
  '-w',
  'zap-warnings.md',
  '-I',
])
