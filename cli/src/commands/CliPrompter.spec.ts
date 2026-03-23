import { describe, expect, it, vi } from 'vitest'

import { ReadlineCliPrompter } from './CliPrompter'

describe('ReadlineCliPrompter', () => {
  it('re-prompts until a valid command is entered', async () => {
    const asker = vi.fn()
      .mockResolvedValueOnce('wat')
      .mockResolvedValueOnce('fetch')
    const prompter = new ReadlineCliPrompter(asker)

    await expect(prompter.promptCommand()).resolves.toBe('fetch')
    expect(asker).toHaveBeenCalledTimes(2)
  })

  it('re-prompts required strings until non-blank input is entered', async () => {
    const asker = vi.fn()
      .mockResolvedValueOnce('   ')
      .mockResolvedValueOnce('2026-q1')
    const prompter = new ReadlineCliPrompter(asker)

    await expect(prompter.promptRequired('Presentation id')).resolves.toBe('2026-q1')
  })

  it('returns undefined for blank optional input', async () => {
    const prompter = new ReadlineCliPrompter(vi.fn().mockResolvedValue(''))

    await expect(prompter.promptOptional('Summary')).resolves.toBeUndefined()
  })

  it('returns a secret value without exposing it in the caller', async () => {
    const prompter = new ReadlineCliPrompter(
      vi.fn(),
      vi.fn().mockResolvedValue('secret-token'),
    )

    await expect(prompter.promptSecret('GitHub PAT')).resolves.toBe('secret-token')
  })

  it('re-prompts secret input until a non-blank value is entered', async () => {
    const askQuestion = vi.fn().mockResolvedValue('unused')
    const askSecret = vi.fn()
      .mockResolvedValueOnce('   ')
      .mockResolvedValueOnce('secret-token')
    const prompter = new ReadlineCliPrompter(askQuestion, askSecret)

    await expect(prompter.promptSecret('GitHub PAT')).resolves.toBe('secret-token')
    expect(askQuestion).not.toHaveBeenCalled()
    expect(askSecret).toHaveBeenCalledTimes(2)
  })

  it('handles boolean defaults and explicit yes/no answers', async () => {
    const withDefault = new ReadlineCliPrompter(vi.fn().mockResolvedValue(''))
    const yesPrompt = new ReadlineCliPrompter(vi.fn().mockResolvedValue('yes'))
    const retryNoPrompt = new ReadlineCliPrompter(
      vi.fn().mockResolvedValueOnce('maybe').mockResolvedValueOnce('n'),
    )

    await expect(withDefault.promptBoolean('Open in browser', false)).resolves.toBe(false)
    await expect(yesPrompt.promptBoolean('Open in browser')).resolves.toBe(true)
    await expect(retryNoPrompt.promptBoolean('Open in browser')).resolves.toBe(false)
  })

  it('handles numeric defaults and re-prompts invalid values', async () => {
    const withDefault = new ReadlineCliPrompter(vi.fn().mockResolvedValue(''))
    const retryValid = new ReadlineCliPrompter(
      vi.fn().mockResolvedValueOnce('oops').mockResolvedValueOnce('4173'),
    )

    await expect(withDefault.promptNumber('Port', 5173)).resolves.toBe(5173)
    await expect(retryValid.promptNumber('Port')).resolves.toBe(4173)
  })
})
