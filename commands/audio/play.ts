import { Message, MessageOptions } from 'discord.js'
import type Bot from '../../init'
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const ytdl = require('ytdl-core')
export async function run (this: Bot, message: Message, args: string[]): Promise<MessageOptions> {
  const vc = message.member?.voice.channel
  if (!vc) {
    return {
      embed: {
        title: 'You kinda fuckin need to be in a voice channel'
      }
    }
  }
  if (!ytdl.validateURL(args.join(' '))) {
    return {
      embed: {
        title: 'Send a YT URL.'
      }
    }
  }

  const connection = await vc.join()
  connection.play(ytdl(args.join(' '), { quality: 'highestaudio' }))
  return {
    embed: {
      title: "Playing...",
      description: 'fuc kyou'
    }
  }
}
export const help = 'A new command'
export const aliases = []
