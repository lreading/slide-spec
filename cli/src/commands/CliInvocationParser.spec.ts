import { describe, expect, it } from 'vitest'

import { CliInvocationParser } from './CliInvocationParser'

describe('CliInvocationParser', () => {
  it('extracts a global log path from mixed arguments', () => {
    const parser = new CliInvocationParser()

    expect(parser.parse([
      '--log-path',
      '/tmp/slide-spec.log',
      'init',
      '--presentation-id',
      'demo',
    ])).toEqual({
      argv: [
        'init',
        '--presentation-id',
        'demo',
      ],
      logPath: '/tmp/slide-spec.log',
    })
  })

  it('supports the equals form for the global log path', () => {
    const parser = new CliInvocationParser()

    expect(parser.parse([
      'help',
      '--log-path=/tmp/slide-spec.log',
    ])).toEqual({
      argv: ['help'],
      logPath: '/tmp/slide-spec.log',
    })
  })

  it('rejects a missing or duplicate log path', () => {
    const parser = new CliInvocationParser()

    expect(() => parser.parse(['--log-path'])).toThrow('Option "--log-path" must include a file path.')
    expect(() => parser.parse(['--log-path', '--presentation-id'])).toThrow(
      'Option "--log-path" must include a file path.',
    )
    expect(() => parser.parse(['--log-path='])).toThrow('Option "--log-path" must include a file path.')
    expect(() => parser.parse(['--log-path', '/tmp/a.log', '--log-path', '/tmp/b.log'])).toThrow(
      'Specify "--log-path" only once.',
    )
    expect(() => parser.parse(['--log-path=/tmp/a.log', '--log-path=/tmp/b.log'])).toThrow(
      'Specify "--log-path" only once.',
    )
  })

  it('ignores blank argv entries while preserving remaining arguments', () => {
    const parser = new CliInvocationParser()

    expect(parser.parse([
      '',
      'fetch',
      '--log-path=/tmp/slide-spec.log',
      '--presentation-id',
      'demo',
    ])).toEqual({
      argv: [
        'fetch',
        '--presentation-id',
        'demo',
      ],
      logPath: '/tmp/slide-spec.log',
    })
  })
})
