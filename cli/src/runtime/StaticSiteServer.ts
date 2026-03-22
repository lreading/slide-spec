import { createReadStream } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const mimeTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

export class StaticSiteServer {
  private server: Server | undefined

  public async start(root: string, host: string, port: number): Promise<void> {
    this.server = createServer(async (request, response) => {
      const requestPath = request.url?.split('?')[0] ?? '/'
      const filePath = this.resolveRequestPath(root, requestPath)

      try {
        await access(filePath)
        response.writeHead(200, {
          'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
        })
        createReadStream(filePath).pipe(response)
      } catch {
        const indexPath = resolve(root, 'index.html')
        response.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
        })
        response.end(await readFile(indexPath, 'utf8'))
      }
    })

    await new Promise<void>((resolvePromise, reject) => {
      this.server?.once('error', reject)
      this.server?.listen(port, host, () => resolvePromise())
    })
  }

  public async close(): Promise<void> {
    await new Promise<void>((resolvePromise) => {
      if (!this.server) {
        resolvePromise()
        return
      }

      this.server.close(() => {
        this.server = undefined
        resolvePromise()
      })
    })
  }

  private resolveRequestPath(root: string, requestPath: string): string {
    const normalizedPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '')
    const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.replace(/^\//, '')
    return join(root, relativePath)
  }
}
