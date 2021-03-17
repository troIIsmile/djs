import { Message, Client, Collection, Intents } from 'discord.js'
import Trollsmile from "trollsmile-core"
import { CommandObj } from "./utils/types"
import process from 'process'
import path, { basename } from 'path'
import { existsSync as exists, readFileSync as read_file } from "fs"
import { createServer as server } from "http"
import { recursive_readdir } from "./utils/rreaddir.js"
import fetch from 'node-fetch'
import { all } from "./messages.js"
import { isMain as is_main } from "./utils/isMain.js"
import 'discord-reply'

// setup ffmpeg
import ffmpegpath from 'ffmpeg-static'
import fluent from 'fluent-ffmpeg'
fluent.setFfmpegPath(ffmpegpath)

// So some files don't import node-fetch
// I actually don't know how it happened
// But just in case
// we set fetch as a global variable
globalThis.fetch = fetch as any

// so i feel that [1,2,3,4].random() is nicer than random([1,2,3,4]) i guess
globalThis.Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}

/**
 * "trollsmile winning" - LuaQuack
 * 
 * The Bot class is a thin wrapper around trollsmile-core that makes it function on Discord.js.
 * Get the client with this.client.
 * 
 * @since 0.0.1
 * @license ISC
 * @author Jack W. <hello@5079.ml> (https://5079.ml)
 */
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

    this.client.on('ready', () => {
      this.activityChanger(900000)
    })

    this.on('output', ([out, message]) => {
      // @ts-expect-error
      message.lineReply(out)
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
  }
  /**
   * Reads the commands folder and imports the command and sets aliases
   * Also logs progress (SIDE EFFECT HOW COOL HOW FUCKING COOL)
   */
  async load_cmds () {
    const files_in_commands = await recursive_readdir('./commands/')
    // currently only supports js
    // MIGHT add Lua support via Fengari
    const commands = files_in_commands.map(file => path.resolve(file)).filter(file => file.endsWith('.js'))
    commands.forEach(async (file, i) => {
      console.log('Importing', file, `${i + 1}/${commands.length}`)
      // we use cache= to bypass Node's module caching
      // this allows -update to function
      const command = Object.assign({ path: 'file://' + file }, await import('file://' + file + `?cache=${Math.random()}`))
      if ('aliases' in command) {
        command.aliases.forEach((alias: string) => {
          this.aliases.set(alias, basename(file, '.js'))
        })
      }
      this.commands.set(basename(file, '.js'), command)
    })
  }
  /**
   * trollsmile funny playing
   * 
   * @param ms The amount of time in milliseconds trollsmile should wait before updating the activity again
   */
  activityChanger (ms: number) {
    // activityChanger from esmBot, also known as "the gamer code"
    const { type, line } = all.random()
    console.log('trollsmile:', line)
    this.client.user!.setActivity(line, {
      type
    })
    setTimeout(() => this.activityChanger(ms), ms)
  }
}

// //====================================================\\
//                    LOADER
//        For when trollsmile is ran directly.
// \\====================================================//
if (is_main(import.meta)) {
  /*
    trollsmile is hosted on replit
    so it would go to sleep after 5 minutes
    so i used cron-job to ping it every 5 minutes
    but obviously to ping it i need a web server
    but i can't host it while developing because uh that breaks Verizon TOS
    (page 23 of
    https://www.verizon.com/about/sites/default/files/Verizon-Customer-Agreement-Int-TV-Voice-Prepaid-031221.pdf
    says "You may not[...]knowingly or unknowingly use the Services to host any type of server")
    so this is what i do to detect it
  */
  if (process.env.REPLIT_DB_URL) {
    server((_, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      })
      res.write(
        `<meta http-equiv="refresh" content="0;url=https://troIIsmile.github.io">`
      )
      res.end()
    }).listen(8080)
  }

  // dotenv implementation
  // because i don't like having more modules installed™
  // it don't support quotes but who tf cares
  if (exists('./.env')) {
    Object.assign(process.env,
      Object.fromEntries(
        read_file('./.env', 'utf-8')
          .split('\n')
          .filter(line => !line.startsWith('#') && line)
          .map(line => line.split('='))
      ))
  }

  // OOPS! All Side Effects
  // also i want a dev prefix
  // so to detect Glitch/replit I do this terrible thing
  // and also if someone is using a sane hosting platform i also check NODE_ENV
  new Bot((process.env.REPLIT_DB_URL || process.env.PORT || process.env.NODE_ENV === 'production') ? '-' : 't!')
}

export default Bot
