import { Message, MessageOptions } from 'discord.js'
import type Bot from '../../init'
import { getAudioUrl } from "google-tts-api"
export async function run (this: Bot, message: Message, args: string[]): Promise<MessageOptions> {
  const vc = message.member?.voice.channel
  if (!vc) {
    return {
      embed: {
        title: 'You kinda fuckin need to be in a voice channel'
      }
    }
  }

  const connection = await vc.join()
  const dispatch = connection.play(getAudioUrl(
    args.filter(arg => !arg.startsWith('--')).join(' '),
    {
      host: 'https://translate.google.com',
      slow: args.includes('--slow'),
      lang: 'en-US'
    }
  ))
  dispatch.on('debug', info => {
    console.debug('[VC DEBUG]', info)
  })
  dispatch.on('finish', () => {
    console.log('[VC]', 'Completed audio', args.join(' '))
  })
  return {
    embed: {
      title: "Playing...",
      description: 'fuc kyou'
    }
  }
}
export const help = 'molly will BARK your tts'
export const aliases = ['vc tts']
