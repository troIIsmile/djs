import { Message, Client, Collection, Intents } from 'discord.js'
import Trollsmile from "trollsmile-core"
import { CommandObj } from "./utils/types"
import { fileURLToPath } from 'url'
import process from 'process'
import path, { basename } from 'path'
import { existsSync, readFileSync as readFile } from "fs"
import { createServer, ServerResponse } from "http"
import { rreaddir } from "./utils/rreaddir.js"
import fetch from 'node-fetch'
import { all } from "./messages.js"

globalThis.fetch = fetch as any // shit workaround in case i missed anything
globalThis.Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}


export function stripExt (name: string) {
  const extension = path.extname(name)
  if (!extension) {
    return name
  }

  return name.slice(0, -extension.length)
}

function isMain (meta: ImportMeta) {
  const modulePath = fileURLToPath(meta.url)

  const scriptPath = process.argv[1]
  const extension = path.extname(scriptPath)
  if (extension) {
    return modulePath === scriptPath
  }

  return stripExt(modulePath) === scriptPath
}

class Bot extends Trollsmile<Message, CommandObj> {
  filter (message: Message) {
    return !message.author.bot
  }
  client: Client
  commands = new Collection<string, CommandObj>()
  constructor(prefix: string, token?: string) {
    super(prefix)
    this.client = new Client({
      ws: {
        intents: [Intents.NON_PRIVILEGED]
      }
    })
    this.client.on('message', message => {
      this.emit('message', message)
    })
    this.on('output', ([out, message]) => {
      message.channel.send(out)
    })

    this.on('error', ([err, message]) => {
      message.channel.stopTyping()
      message.channel.send({
        embed: {
          author: {
            name: `${this.client.user?.username} ran into an error while running your command!`,
            iconURL: this.client.user?.avatarURL() || undefined
          },
          title: err.toString(),
          color: 'RED'
        }
      })
    })
    this.client.login(token)
    this.load_cmds()
    this.activityChanger()
  }
  async load_cmds () {
    const files_in_commands = await rreaddir('./commands/')
    const commands = files_in_commands.map(file => path.resolve(file)).filter(file => file.endsWith('.js'))
    commands.forEach(async (file, i) => {
      console.log('Importing', file, `${i + 1}/${commands.length}`)
      const command = Object.assign({ path: 'file://' + file }, await import('file://' + file + `?cache=${Math.random()}`))
      if ('aliases' in command) {
        command.aliases.forEach((alias: string) => {
          this.aliases.set(alias, basename(file, '.js'))
        })
      }
      this.commands.set(basename(file, '.js'), command)
    })
  }
  activityChanger () {
    // activityChanger from esmBot, also known as "the gamer code"
    this.client.user?.setActivity(all.random())
    setTimeout(this.activityChanger.bind(this), 900000)
  }
}

if (isMain(import.meta)) {
  // replit redirect
  if (process.env.REPLIT_DB_URL) {
    createServer((_, res: ServerResponse) => {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(
        `<meta http-equiv="refresh" content="0;url=https://troIIsmile.github.io">`
      )
      res.end()
    }).listen(8080)
  }
  if (existsSync('./.env')) {
    Object.assign(process.env,
      Object.fromEntries(
        // Overwrite the env with the .env file
        readFile('./.env', 'utf-8')
          .split('\n') // split the file into lines
          .filter(line => !line.startsWith('#') && line) // remove comments and spacing
          .map(line => line.split('=')) // split the lines into key:value pairs
      ))
  }
  new Bot('-', process.env.TOKEN)
}

export default Bot
