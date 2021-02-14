import type { Message, TextChannel } from 'discord.js'
import type Bot from '..'

type Return = Parameters<TextChannel['send']>[0]

interface CommandObj {
  run: (this: Bot, message: Message, args: string[]) => Return | Promise<Return>,
  help: string,
  path: string,
  aliases?: string[]
}


export {
  Bot, CommandObj
}
