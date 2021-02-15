import { Message, Client, Collection, Intents } from 'discord.js'
import Trollsmile from "trollsmile-core"
import { CommandObj } from "./utils/types"
import process from 'process'
import path, { basename } from 'path'
import { existsSync, readFileSync as readFile } from "fs"
import { createServer, ServerResponse } from "http"
import { rreaddir } from "./utils/rreaddir.js"
import fetch from 'node-fetch'
import { all } from "./messages.js"
import { isMain } from "./utils/isMain.js"

globalThis.fetch = fetch as any // shit workaround in case i missed anything
globalThis.Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}


class Bot extends Trollsmile<Message, CommandObj> {
  filter (message: Message) {
    return !message.author.bot
  }
  client: Client
  commands = new Collection<string, CommandObj>()
  constructor(prefix: string) {
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
    this.client.login() // process.env.DISCORD_TOKEN
    this.load_cmds()
    this.client.on('ready', () => {
      this.activityChanger()
    })
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
    const message = all.random()
    console.log('trollsmile:', message)
    this.client.user!.setActivity(message, {
      type: 'LISTENING'
    })
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
  new Bot('-')
}

export default Bot
