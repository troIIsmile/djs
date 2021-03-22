import type { Message, TextChannel } from 'discord.js'
import type Bot from '..'

type Return = Parameters<TextChannel['send']>[0]

interface CommandObj {
  run: (this: Bot, message: Message, args: string[]) => Return | Promise<Return>,
  help: string,
  // Path is used in -reload to figure out where the command is so it can yknow fuckin reload it
  path: string,
  aliases?: string[]
}


export {
  Bot, CommandObj
}
