import { spawn } from 'node:child_process'

type SpawnFunction = typeof spawn

export class BrowserOpener {
  public constructor(
    private readonly spawnCommand: SpawnFunction = spawn,
    private readonly platform = process.platform,
  ) {}

  public open(url: string): void {
    const command = this.getCommand(url)

    this.spawnCommand(command.command, command.args, {
      detached: true,
      stdio: 'ignore',
      shell: false,
    }).unref()
  }

  private getCommand(url: string): { command: string; args: string[] } {
    if (this.platform === 'win32') {
      return {
        command: 'cmd.exe',
        args: ['/c', 'start', '', url],
      }
    }

    if (this.platform === 'darwin') {
      return {
        command: 'open',
        args: [url],
      }
    }

    return {
      command: 'xdg-open',
      args: [url],
    }
  }
}
