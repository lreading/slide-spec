import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..')
const publicSchemaRoot = resolve(repoRoot, 'slides', 'public')
const yamlSettings = {
  validate: true,
  schemaStore: { enable: false },
  schemas: {},
}

interface JsonRpcMessage {
  jsonrpc: '2.0'
  id?: number
  method?: string
  params?: unknown
  result?: unknown
  error?: unknown
}

interface Diagnostic {
  message: string
}

interface CompletionItem {
  label: string
}

interface CompletionList {
  items: CompletionItem[]
}

class LocalSchemaServer {
  private readonly server = createServer((request, response) => {
    void this.handleRequest(request.url ?? '/')
      .then((body) => {
        response.writeHead(200, { 'content-type': 'application/schema+json' })
        response.end(body)
      })
      .catch(() => {
        response.writeHead(404)
        response.end('Not found')
      })
  })

  private baseUrl = ''

  async start(): Promise<string> {
    await new Promise<void>((resolveStart) => {
      this.server.listen(0, '127.0.0.1', resolveStart)
    })

    const address = this.server.address()
    if (!address || typeof address === 'string') throw new Error('Schema server did not bind to a TCP port.')

    this.baseUrl = `http://127.0.0.1:${address.port}`
    return this.baseUrl
  }

  async stop(): Promise<void> {
    await new Promise<void>((resolveStop, reject) => {
      this.server.close((error) => {
        if (error) reject(error)
        else resolveStop()
      })
    })
  }

  private async handleRequest(url: string): Promise<string> {
    const path = url === '/schema.json' ? 'schema.json' : url.replace(/^\//, '')
    const body = await readFile(resolve(publicSchemaRoot, path), 'utf8')

    return body.replaceAll('https://slide-spec.dev', this.baseUrl)
  }
}

class YamlLanguageServerClient {
  private readonly child: ChildProcessWithoutNullStreams
  private buffer = Buffer.alloc(0)
  private nextId = 1
  private readonly pending = new Map<number, (message: JsonRpcMessage) => void>()
  private readonly diagnostics = new Map<string, Diagnostic[]>()
  private readonly diagnosticsWaiters = new Map<string, Array<(diagnostics: Diagnostic[]) => void>>()

  constructor() {
    this.child = spawn(resolve(repoRoot, 'shared', 'node_modules', '.bin', languageServerBin()), ['--stdio'], {
      cwd: resolve(repoRoot, 'shared'),
    })
    this.child.stdout.on('data', (chunk: Buffer) => this.handleOutput(chunk))
  }

  async initialize(): Promise<void> {
    await this.request('initialize', {
      processId: process.pid,
      rootUri: pathToFileURL(repoRoot).toString(),
      capabilities: {
        textDocument: {
          completion: { completionItem: { snippetSupport: false } },
        },
        workspace: { configuration: true },
      },
      initializationOptions: { schemaStore: { enable: false } },
    })
    this.notify('initialized', {})
    this.notify('workspace/didChangeConfiguration', { settings: { yaml: yamlSettings } })
  }

  async stop(): Promise<void> {
    if (!this.child.killed) {
      await this.request('shutdown', {})
      this.notify('exit', {})
    }
  }

  async openDocumentAndWaitForDiagnostics(uri: string, text: string): Promise<Diagnostic[]> {
    const diagnosticsPromise = this.waitForDiagnostics(uri)
    this.notify('textDocument/didOpen', {
      textDocument: { uri, languageId: 'yaml', version: 1, text },
    })

    return diagnosticsPromise
  }

  async completionLabels(uri: string, line: number, character: number): Promise<string[]> {
    const result = await this.request('textDocument/completion', {
      textDocument: { uri },
      position: { line, character },
    })
    const items = Array.isArray(result)
      ? result as CompletionItem[]
      : (result as CompletionList).items

    return items.map((item) => item.label)
  }

  private request(method: string, params: unknown): Promise<unknown> {
    const id = this.nextId
    this.nextId += 1
    this.send({ jsonrpc: '2.0', id, method, params })

    return new Promise((resolveRequest, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`Timed out waiting for ${method}.`))
      }, 5_000)

      this.pending.set(id, (message) => {
        clearTimeout(timeout)
        if (message.error) reject(new Error(JSON.stringify(message.error)))
        else resolveRequest(message.result)
      })
    })
  }

  private notify(method: string, params: unknown): void {
    this.send({ jsonrpc: '2.0', method, params })
  }

  private send(message: JsonRpcMessage): void {
    const body = JSON.stringify(message)
    this.child.stdin.write(`Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n${body}`)
  }

  private handleOutput(chunk: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, chunk])

    while (true) {
      const headerEnd = this.buffer.indexOf('\r\n\r\n')
      if (headerEnd === -1) return

      const header = this.buffer.subarray(0, headerEnd).toString('utf8')
      const contentLength = /Content-Length: (\d+)/iu.exec(header)
      if (!contentLength) throw new Error(`Missing Content-Length header: ${header}`)

      const bodyStart = headerEnd + 4
      const bodyEnd = bodyStart + Number(contentLength[1])
      if (this.buffer.length < bodyEnd) return

      const message = JSON.parse(this.buffer.subarray(bodyStart, bodyEnd).toString('utf8')) as JsonRpcMessage
      this.buffer = this.buffer.subarray(bodyEnd)
      this.handleMessage(message)
    }
  }

  private handleMessage(message: JsonRpcMessage): void {
    if (message.id !== undefined && message.method) {
      this.handleServerRequest(message)
      return
    }

    if (message.id !== undefined) {
      this.pending.get(message.id)?.(message)
      this.pending.delete(message.id)
      return
    }

    if (message.method === 'textDocument/publishDiagnostics') {
      const params = message.params as { uri: string, diagnostics: Diagnostic[] }
      this.diagnostics.set(params.uri, params.diagnostics)
      const waiters = this.diagnosticsWaiters.get(params.uri) ?? []
      this.diagnosticsWaiters.delete(params.uri)
      for (const waiter of waiters) waiter(params.diagnostics)
    }
  }

  private handleServerRequest(message: JsonRpcMessage): void {
    if (message.id === undefined) throw new Error(`Server request ${message.method ?? 'unknown'} did not include an id.`)

    if (message.method === 'workspace/configuration') {
      const params = message.params as { items?: Array<{ section?: string }> }
      const result = (params.items ?? []).map((item) => item.section === 'yaml' ? yamlSettings : null)
      this.send({ jsonrpc: '2.0', id: message.id, result })
      return
    }

    this.send({ jsonrpc: '2.0', id: message.id, result: null })
  }

  private waitForDiagnostics(uri: string): Promise<Diagnostic[]> {
    const existingDiagnostics = this.diagnostics.get(uri)
    if (existingDiagnostics) return Promise.resolve(existingDiagnostics)

    return new Promise((resolveWait, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timed out waiting for diagnostics for ${uri}.`))
      }, 5_000)
      const waiters = this.diagnosticsWaiters.get(uri) ?? []
      waiters.push((diagnostics) => {
        clearTimeout(timeout)
        resolveWait(diagnostics)
      })
      this.diagnosticsWaiters.set(uri, waiters)
    })
  }
}

function languageServerBin(): string {
  return process.platform === 'win32' ? 'yaml-language-server.cmd' : 'yaml-language-server'
}

function schemaComment(schemaUrl: string): string {
  return `# yaml-language-server: $schema=${schemaUrl}`
}

function documentUri(name: string): string {
  return pathToFileURL(resolve(repoRoot, `.tmp-yaml-language-server-${name}.yaml`)).toString()
}

function siteDocument(schemaUrl: string): string {
  return `${schemaComment(schemaUrl)}
schemaVersion: 1
site:
  title: Demo
  home_intro: Intro
  home_cta_label: Start
  presentations_cta_label: Decks
  links:
    repository:
      label: Repo
      url: https://example.com/repo
    docs:
      label: Docs
      url: https://example.com/docs
    community:
      label: Community
      url: https://example.com/community
`
}

const presentationDocument = (schemaUrl: string): string => `${schemaComment(schemaUrl)}
schemaVersion: 1
presentation:
  id: demo
  title: Demo
  subtitle: Example
  slides:
    - template: hero
      enabled: true
      content:
        title_primary: Demo
`

const generatedDocument = (schemaUrl: string): string => `${schemaComment(schemaUrl)}
schemaVersion: 1
generated:
  id: demo
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats: {}
  releases:
    - id: v1
      version: v1
      url: https://example.com/releases/v1
      published_at: 2026-01-15
      summary_bullets:
        - Shipped the demo
  contributors:
    total: 1
    authors:
      - login: leo
        name: Leo
        avatar_url: https://example.com/avatar.png
        merged_prs: 1
        first_time: false
`

describe('YAML language server schema integration', () => {
  let schemaBaseUrl = ''
  let schemaServer: LocalSchemaServer
  let languageServer: YamlLanguageServerClient

  beforeAll(async () => {
    schemaServer = new LocalSchemaServer()
    schemaBaseUrl = await schemaServer.start()
    languageServer = new YamlLanguageServerClient()
    await languageServer.initialize()
  }, 10_000)

  afterAll(async () => {
    await languageServer.stop()
    await schemaServer.stop()
  }, 10_000)

  it('reports no diagnostics for valid files with yaml-language-server schema comments', async () => {
    const fixtures: Array<[string, string]> = [
      ['site-specific', siteDocument(`${schemaBaseUrl}/schema/site.schema.json`)],
      ['presentation-specific', presentationDocument(`${schemaBaseUrl}/schema/presentation.schema.json`)],
      ['generated-specific', generatedDocument(`${schemaBaseUrl}/schema/generated.schema.json`)],
      ['dispatcher', presentationDocument(`${schemaBaseUrl}/schema.json`)],
    ]

    for (const [name, document] of fixtures) {
      await expect(languageServer.openDocumentAndWaitForDiagnostics(documentUri(name), document)).resolves.toEqual([])
    }
  })

  it('reports diagnostics for schema violations through the editor validation path', async () => {
    const invalidSite = siteDocument(`${schemaBaseUrl}/schema/site.schema.json`).replace(
      '  links:',
      '  surprise: true\n  links:',
    )
    const invalidPresentation = presentationDocument(`${schemaBaseUrl}/schema/presentation.schema.json`).replace(
      'template: hero',
      'template: nope',
    )
    const invalidGenerated = generatedDocument(`${schemaBaseUrl}/schema/generated.schema.json`).replace(
      '      version: v1\n',
      '',
    )

    const invalidFixtures: Array<[string, string]> = [
      ['invalid-site', invalidSite],
      ['invalid-presentation', invalidPresentation],
      ['invalid-generated', invalidGenerated],
    ]

    for (const [name, document] of invalidFixtures) {
      const diagnostics = await languageServer.openDocumentAndWaitForDiagnostics(documentUri(name), document)
      expect(diagnostics.map((diagnostic) => diagnostic.message).join('\n'), name).not.toHaveLength(0)
    }
  })

  it('uses the schema comment for YAML key completions', async () => {
    const uri = documentUri('site-completions')
    const document = `${schemaComment(`${schemaBaseUrl}/schema/site.schema.json`)}
schemaVersion: 1
site:
  `

    await languageServer.openDocumentAndWaitForDiagnostics(uri, document)
    const labels = await languageServer.completionLabels(uri, 3, 2)

    expect(labels).toContain('title')
    expect(labels).toContain('home_intro')
  })
})
