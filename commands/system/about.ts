import { MessageOptions, version as discordVersion } from 'discord.js'
import { Bot } from '../../utils/types'
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const { homepage: url, version } = require('../../package.json')
export async function run (this: Bot): Promise<MessageOptions> {
  const timestamp = process.uptime()

  // hours
  const hours = Math.floor(timestamp / 60 / 60)

  const owner = this.client.users.cache.get(process.env.OWNER!) || await this.client.users.fetch(process.env.OWNER!)

  if (!(this.client.user && owner)) return {
    content: 'oops the owner or the bot user does not exist some how'
  }
  return {
    embed: {
      author: {
        url,
        name: `About ${this.client.user.username}`,
        iconURL: this.client.user?.displayAvatarURL()
      },
      color: 0x454545,
      footer: {
        text: `Owned by ${owner.tag}`,
        iconURL: owner.displayAvatarURL()
      },
      fields: [{
        name: '💬 Server Count',
        value: this.client.guilds.cache.size,
        inline: true
      }, {
        name: 'ℹ Bot Version',
        value: version, inline: true
      }, {
        name: '📚 Discord.js Version',
        value: discordVersion, inline: true
      }, {
        name: '⏰ Uptime',
        value: [hours, Math.floor(timestamp / 60) - (hours * 60), Math.floor(timestamp % 60)].join(':'),
        inline: true
      }, {
        name: '🖥 OS',
        value: process.platform,
        inline: true
      }, {
        name: '>_ Command Count',
        value: this.commands.size,
        inline: true
      }]
    }
  }
}

export const help = 'Statistics about the bot.'
export const aliases = ['list', 'stats']
