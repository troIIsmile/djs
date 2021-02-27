import { Message, MessageOptions } from 'discord.js'
import type Bot from '../../init'
import is_roblox from 'is-roblox-ip'
export async function run (this: Bot, message: Message, args: string[]): Promise<MessageOptions> {
  const ip_regex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm
  if (ip_regex.test(args.join('')) && is_roblox(args.join(''))) {
    return {
      embed: {
        color: 'GREEN',
        title: 'That IP is a Roblox server.'
      }
    }
  } else {
    return {
      embed: {
        color: 'RED',
        title: 'That IP is not a Roblox server.'
      }
    }
  }
}
export const help = 'A new command'
export const aliases = []
