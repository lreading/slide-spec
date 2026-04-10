#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, rmSync } from 'node:fs'
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
  console.error(`No video.webm found under ${artifactsDir}. Run the Playwright readme recording first.`)
  process.exit(1)
}

const palette = join(repoRoot, 'assets/readme-demo-palette.png')
const outGif = join(repoRoot, 'assets/readme-demo.gif')
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-i', webm,
    '-vf', 'fps=10,scale=960:-1:flags=lanczos,palettegen',
    '-frames:v', '1',
    palette,
  ],
  { stdio: 'inherit' },
)

execFileSync(
  'ffmpeg',
  [
    '-y',
    '-i', webm,
    '-i', palette,
    '-lavfi', 'fps=10,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse',
    outGif,
  ],
  { stdio: 'inherit' },
)

rmSync(palette, { force: true })

console.log(`Wrote ${outGif}`)
