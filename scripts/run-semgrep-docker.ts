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
  `${process.cwd()}:/src`,
]

if (gitCommonDir && existsSync(gitCommonDir)) {
  args.push('-v', `${gitCommonDir}:${gitCommonDir}:ro`)
}

args.push(
  'semgrep/semgrep:1.124.0',
  'semgrep',
  'scan',
  '--config',
  'auto',
  '--error',
  '--json',
  '--output',
  '/src/semgrep-results.json',
  '/src',
)

const result = spawnSync('docker', args, { stdio: 'inherit' })

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
