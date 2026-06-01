import { spawnSync } from 'node:child_process'

interface Step {
  readonly name: string
  readonly command: readonly string[]
}

const steps: readonly Step[] = [
  { name: 'root verify', command: ['pnpm', 'run', 'verify'] },
  { name: 'cli package', command: ['pnpm', '--filter', '@slide-spec/cli', 'package:verify'] },
  { name: 'docs a11y', command: ['pnpm', '--filter', '@slide-spec/docs', 'a11y'] },
  { name: 'markdownlint', command: ['pnpm', 'run', 'lint:markdown'] },
  { name: 'root spellcheck', command: ['pnpm', 'run', 'spellcheck'] },
  { name: 'links', command: ['pnpm', 'run', 'links'] },
  { name: 'trivy', command: ['pnpm', 'run', 'security:trivy'] },
  { name: 'semgrep', command: ['pnpm', 'run', 'security:semgrep'] },
  { name: 'gitleaks', command: ['pnpm', 'run', 'security:gitleaks'] },
  { name: 'sbom', command: ['pnpm', 'run', 'sbom'] },
  { name: 'dast', command: ['pnpm', 'run', 'dast'] },
]

for (const step of steps) {
  console.log(`\n> ${step.name}`)
  const result = spawnSync(step.command[0]!, step.command.slice(1), {
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
