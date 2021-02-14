import { exec } from "child_process"
import { Message } from 'discord.js'
import { platform } from "os"
import { Bot } from '../../utils/types'

const shell = (str: string) => new Promise<string>((resolve, reject) => {
  exec(str, (err, stdout, stderr) => {
    if (err) reject(stderr)
    resolve(stdout)
  })
})
interface Step {
  name: string
  run (this: Bot): void | Promise<void>
}

async function update (this: Bot, message: Message, steps: Step[]) {
  const brand = `${this.client.user?.username || 'trollsmile'} update`
  const start = new Date
  const msg = await message.channel.send({
    embed: {
      author: {
        name: brand,
        icon_url: this.client.user?.avatarURL() || undefined
      },
      title: 'Update starting...'
    }
  })

  for (const step of steps) {
    msg.edit({
      embed: {
        author: {
          name: brand,
          icon_url: this.client.user?.avatarURL() || undefined
        },
        title: step.name
      }
    })
    await step.run.call(this)
  }
  msg.edit({
    embed: {
      author: {
        name: brand,
        icon_url: this.client.user?.avatarURL() || undefined
      },
      color: 'GREEN',
      title: `Update complete! Took ${(new Date().getTime() - start.getTime())}ms`,
      description: 'Restart the bot to reload events and messages.'
    }
  })
}

export async function run (
  this: Bot,
  message: Message
): Promise<void> {
  if (message.author.id === process.env.OWNER) {
    update.call(this, message, [
      {
        name: 'Downloading latest trollsmile...',
        async run () {
          await shell('git fetch origin main')
          await shell('git reset --hard origin/main')
        }
      },
      {
        name: 'Updating dependencies...',
        async run () {
          await shell('npm i')
        }
      },
      {
        name: 'Compiling...',
        async run () {
          await shell(
            platform() === 'win32'
              ? 'PowerShell -Command "rm commands/**/*.js"'
              : 'rm commands/**/*.js'
          ) // remove previous files because what if i deleted a command
          await shell('npx tsc')
        }
      },
      {
        name: 'Reloading all commands...',
        async run () {
          this.commands.clear()
          this.aliases.clear()
          await this.load_cmds()
        }
      }
    ])
  } else {
    message.reply('You are not the bot owner.')
  }
}

export const help = 'Updates the bot.'
