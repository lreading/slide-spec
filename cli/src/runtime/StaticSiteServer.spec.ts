import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { Writable } from 'node:stream'

import { afterEach, describe, expect, it } from 'vitest'

import { StaticSiteServer } from './StaticSiteServer'

import type { IncomingMessage, Server, ServerResponse } from 'node:http'

const tempRoots: string[] = []

class ResponseCapture extends Writable {
  public statusCode = 200
  public headers: Record<string, string> = {}
  private readonly chunks: Buffer[] = []

  public override _write(chunk: Buffer | string, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    this.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    callback()
  }

  public writeHead(statusCode: number, headers: Record<string, string>): this {
    this.statusCode = statusCode
    this.headers = headers
    return this
  }

  public override end(cb?: () => void): this
  public override end(chunk: string | Buffer, cb?: () => void): this
  public override end(chunk: string | Buffer, encoding: BufferEncoding, cb?: () => void): this
  public override end(
    chunkOrCallback?: string | Buffer | (() => void),
    encodingOrCallback?: BufferEncoding | (() => void),
    callback?: () => void,
  ): this {
    const chunk = typeof chunkOrCallback === 'function' ? undefined : chunkOrCallback
    const resolvedCallback = typeof chunkOrCallback === 'function'
      ? chunkOrCallback
      : typeof encodingOrCallback === 'function'
        ? encodingOrCallback
        : callback

    if (chunk !== undefined) {
      this.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    resolvedCallback?.()
    super.end()
    return this
  }

  public getBody(): string {
    return Buffer.concat(this.chunks).toString('utf8')
  }
}

interface ServerHarness {
  handler?: (request: IncomingMessage, response: ServerResponse) => Promise<void>
  address?: AddressInfo
}

function createServerDouble(harness: ServerHarness): Server {
  return {
    once: () => undefined,
    listen: (_port: number, _host: string, callback?: () => void) => {
      callback?.()
      return createServerDouble(harness)
    },
    close: (callback?: (error?: Error) => void) => {
      callback?.()
      return createServerDouble(harness)
    },
    address: () => harness.address ?? null,
  } as unknown as Server
}

async function sendRequest(
  handler: (request: IncomingMessage, response: ServerResponse) => Promise<void>,
  url: string,
): Promise<ResponseCapture> {
  const response = new ResponseCapture()
  await handler({ url } as IncomingMessage, response as unknown as ServerResponse)
  await new Promise<void>((resolvePromise) => {
    if (response.writableFinished) {
      resolvePromise()
      return
    }

    response.once('finish', () => resolvePromise())
  })
  return response
}

describe('StaticSiteServer', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

  it('serves static assets and falls back to index.html for routes', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'slide-spec-static-'))
    tempRoots.push(root)
    await writeFile(resolve(root, 'index.html'), '<html>home</html>')
    await writeFile(resolve(root, 'app.css'), 'body{}')
    await writeFile(resolve(root, 'blob.bin'), 'blob')

    const harness: ServerHarness = {}
    const server = new StaticSiteServer((listener) => {
      harness.handler = listener
      harness.address = {
        address: '127.0.0.1',
        family: 'IPv4',
        port: 4173,
      }
      return createServerDouble(harness)
    })

    await expect(server.start(root, '127.0.0.1', 4173)).resolves.toBe(4173)

    const homeResponse = await sendRequest(harness.handler as NonNullable<ServerHarness['handler']>, '/')
    const assetResponse = await sendRequest(harness.handler as NonNullable<ServerHarness['handler']>, '/app.css')
    const blobResponse = await sendRequest(harness.handler as NonNullable<ServerHarness['handler']>, '/blob.bin?cache=1')
    const routeResponse = await sendRequest(harness.handler as NonNullable<ServerHarness['handler']>, '/presentations/demo')

    expect(homeResponse.getBody()).toContain('home')
    expect(homeResponse.headers['Content-Type']).toBe('text/html; charset=utf-8')
    expect(assetResponse.getBody()).toContain('body')
    expect(assetResponse.headers['Content-Type']).toBe('text/css; charset=utf-8')
    expect(blobResponse.getBody()).toContain('blob')
    expect(blobResponse.headers['Content-Type']).toBe('application/octet-stream')
    expect(routeResponse.getBody()).toContain('home')
    expect(routeResponse.headers['Content-Type']).toBe('text/html; charset=utf-8')

    await server.close()
  })

  it('can be closed before start without throwing', async () => {
    await expect(new StaticSiteServer().close()).resolves.toBeUndefined()
  })
})
