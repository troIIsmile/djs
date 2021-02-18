import { Message, MessageOptions } from 'discord.js'
import fetch from "node-fetch"
import type Bot from '../../init'
import unfluff from 'unfluff'
export async function run (this: Bot, message: Message, args: string[]): Promise<MessageOptions | string> {
  const url = new URL(args.join('%20'))
  if (url.hostname === 'discord.com' || url.hostname === 'discordapp.com') {
    return "That doesn't sound like a good idea."
  }
  const html = await fetch(url.href).then(res => res.text())
  const { title, author: authors, description, copyright, date, image, publisher } = unfluff(html)
  return {
    embed: {
      author: {
        name: authors.join(','),
      },
      url: args.join(' '),
      title: title,
      description: description,
      timestamp: new Date(date),
      image: {
        url: image,
      },
      footer: {
        text: `Pubished by ${publisher}. © ${copyright}`
      }
    }
  }
}
export const help = 'Get info about an article'
export const aliases = []
