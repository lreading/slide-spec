import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const gitCommonDir = spawnSync(
  'git',
  ['rev-parse', '--path-format=absolute', '--git-common-dir'],
  { encoding: 'utf8' },
).stdout.trim()

const args = [
  'run',
  '--rm',
  '-v',
  `${process.cwd()}:/repo`,
]

if (gitCommonDir && existsSync(gitCommonDir)) {
  args.push('-v', `${gitCommonDir}:${gitCommonDir}:ro`)
}

args.push(
  'zricethezav/gitleaks:v8.28.0',
  'detect',
  '--source',
  '/repo',
  '--report-format',
  'sarif',
  '--report-path',
  '/repo/gitleaks-results.sarif',
  '--redact',
  '--no-banner',
)

const result = spawnSync('docker', args, { stdio: 'inherit' })

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
