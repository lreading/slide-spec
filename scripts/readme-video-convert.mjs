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
  console.error(`No video.webm found under ${artifactsDir}. Run the Playwright readme recording first.`)
  process.exit(1)
}

const outMp4 = join(repoRoot, 'assets/readme-demo.mp4')
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-ss', '4.0',
    '-i', webm,
    '-an',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-preset', 'slow',
    '-crf', '23',
    '-vf', 'scale=1280:-2',
    outMp4,
  ],
  { stdio: 'inherit' },
)

console.log(`Wrote ${outMp4}`)
