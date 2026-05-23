import { spawn, spawnSync } from 'node:child_process'

function run(command: string, args: readonly string[]): void {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run('pnpm', ['--filter', '@slide-spec/docs', 'build'])

const server = spawn(
  'pnpm',
  ['exec', 'http-server', './docs/.vitepress/dist', '-p', '4174'],
  {
    stdio: 'ignore',
  },
)

const stopServer = (): void => {
  server.kill()
}

process.on('exit', stopServer)
process.on('SIGINT', () => {
  stopServer()
  process.exit(130)
})

await new Promise((resolve) => setTimeout(resolve, 2000))

run('docker', [
  'run',
  '--rm',
  '--network',
  'host',
  '-v',
  `${process.cwd()}:/repo`,
  'lycheeverse/lychee:latest',
  '--verbose',
  '--no-progress',
  '--config',
  '/repo/.github/lychee.toml',
  '/repo/README.md',
])

run('docker', [
  'run',
  '--rm',
  '--network',
  'host',
  '-v',
  `${process.cwd()}:/repo`,
  'lycheeverse/lychee:latest',
  '--verbose',
  '--no-progress',
  '--config',
  '/repo/.github/lychee.toml',
  '--base-url',
  'http://127.0.0.1:4174/',
  '/repo/docs/.vitepress/dist/**/*.html',
])

stopServer()
