#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const artifactsDir = join(repoRoot, 'assets/readme-gif-artifacts')

function findWebm(dir) {
  if (!existsSync(dir)) {
    return undefined
  }
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      const nested = findWebm(full)
      if (nested) {
        return nested
      }
    } else if (entry.name === 'video.webm') {
      return full
    }
  }
  return undefined
}

const webm = findWebm(artifactsDir)
if (!webm) {
  console.error(`No video.webm found under ${artifactsDir}. Run the Playwright readme GIF test first.`)
  process.exit(1)
}

const outGif = join(repoRoot, 'assets/readme-demo.gif')
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-ss',
    '0.6',
    '-i',
    webm,
    '-vf',
    'fps=6,scale=720:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96[p];[s1][p]paletteuse',
    outGif,
  ],
  { stdio: 'inherit' },
)

console.log(`Wrote ${outGif}`)
