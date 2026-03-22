import { describe, expect, it } from 'vitest'

import { BrowserOpener } from './BrowserOpener'

describe('BrowserOpener', () => {
  it('uses platform-specific browser commands', () => {
    const calls: Array<{ command: string; args: string[]; unrefCalled: boolean }> = []
    const spawnCommand = (command: string, args: readonly string[]) => {
      const record = {
        command,
        args: [...args],
        unrefCalled: false,
      }
      calls.push(record)
      return {
        unref: () => {
          record.unrefCalled = true
        },
      } as never
    }
    const url = 'http://127.0.0.1:4173/'

    new BrowserOpener(spawnCommand as never, 'linux').open(url)
    new BrowserOpener(spawnCommand as never, 'darwin').open(url)
    new BrowserOpener(spawnCommand as never, 'win32').open(url)

    expect(calls).toEqual([
      {
        command: 'xdg-open',
        args: [url],
        unrefCalled: true,
      },
      {
        command: 'open',
        args: [url],
        unrefCalled: true,
      },
      {
        command: 'cmd.exe',
        args: ['/c', 'start', '', url],
        unrefCalled: true,
      },
    ])
  })
})
