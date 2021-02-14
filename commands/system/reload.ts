import { Message } from 'discord.js'
import { Bot } from '../../utils/types'
import { MessageOptions } from 'discord.js'

export async function run (this: Bot, message: Message, args: string[]): Promise<MessageOptions | string> {
  if (message.author.id !== process.env.OWNER) return '❌ This command is for the bot owner only.'
  const cmdname = this.getCommandName(args.join(' '))
  if (!cmdname) return '❌ That command does not exist!'
  // Remove cache and aliases
  const path = this.commands.get(cmdname)?.path! // Jesus fucking christ TypeScript I just need the path
  if (this.commands.get(cmdname)?.aliases) {
    this.commands.get(cmdname)?.aliases?.forEach(Map.prototype.delete.bind(this.aliases))
  }

  // Load the command
  this.commands.set(cmdname, { ...(await import(path + `?cache=${Math.random()}`)), path })

  // Add the aliases back
  if (this.commands.get(cmdname)?.aliases) {
    this.commands.get(cmdname)?.aliases?.forEach(alias => {
      this.aliases.set(alias, cmdname)
    })
  }

  return {
    embed: {
      author: {
        name: 'Command reloaded!',
        iconURL: this.client.user?.displayAvatarURL()
      },
      color: 'GREEN',
      title: cmdname,
      description: (await import(path)).desc,
      fields: [{
        name: 'Aliases',
        value: ((await import(path)).aliases) ? ((await import(path)).aliases).join(', ') : ''
      }].filter(({ value }) => value)
    }
  }
}
export const help = 'Reloads a command.'
export const aliases = []
