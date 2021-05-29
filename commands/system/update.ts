import { exec } from 'child_process'
import { MessageButton } from 'discord-buttons'
import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js'
import { platform } from 'os'
import { Bot } from '../../utils/types'

const shell = (str: string) =>
  new Promise<string>((resolve, reject) => {
    exec(str, (err, stdout, stderr) => {
      if (err) reject(stderr)
      resolve(stdout)
    })
  })

/**
 * A step used with the update helper function.
 */
interface Step {
  /**
   * The name of the step. Used at the end and while the step is running.
   */
  name: string
  /**
   * The thing it runs.
   * If it is a function, it will run it. It will await if the function is async.
   * If it is a string, it will run it in the shell and wait for it to finish.
   * If it is an array of strings, it will run them in the shell in order.,
   */
  run: ((this: Bot) => void | Promise<void>) | string | string[]
  /**
   * @private
   */
  time?: number
}

function componentToHex(c: number) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

/**
 * A helper function for the update command.
 * Takes steps and runs them in order and at the end says how long each step took
 *
 * @param this The bot object. See init.ts
 * @param message
 * @param steps
 */
async function update(
  this: Bot,
  channel: TextChannel | DMChannel | NewsChannel,
  steps: Step[]
) {
  const brand = `${this.client.user?.username || 'trollsmile'} update`
  const msg = await channel.send('Update starting...')

  for (const step of steps) {
    const step_start = new Date()

    await msg.edit({
      content: 'Updating...',
      // @ts-ignore
      buttons: steps.map((s, i) => {
        const completed = i < steps.indexOf(step)
        return new MessageButton()
          .setStyle(s === step ? 'blurple' : 'gray')
          .setDisabled(!completed)
          .setLabel(s.name)
      })
    })
    if (typeof step.run === 'string') {
      await shell(step.run)
    } else if (Array.isArray(step.run)) {
      for (const command of step.run) {
        await shell(command)
      }
    } else {
      await step.run.call(this)
    }
    step.time = new Date().getTime() - step_start.getTime()
  }
  msg.edit({
    embed: {
      author: {
        name: brand,
        icon_url: this.client.user?.avatarURL() || undefined
      },
      // @ts-ignore
      buttons: [],
      color: 'GREEN',
      title: `Update complete! Took ${steps.reduce(
        (a, b) => a + b.time!,
        0
      )}ms`,
      description: 'Restart the bot to reload events and messages.',
      fields: steps.map((step) => ({
        name: step.name,
        value: `${step.time!}ms`,
        inline: true
      }))
    }
  })
}

export async function run(this: Bot, message: Message): Promise<void> {
  if (message.author.id === process.env.OWNER) {
    update.call(this, message.channel, [
      {
        name: 'Downloading latest trollsmile...',
        run: ['git fetch origin main', 'git reset --hard origin/main']
      },
      {
        name: 'Updating dependencies...',
        run: 'npm i'
      },
      {
        name: 'Compiling...',
        run: [
          platform() === 'win32'
            ? 'PowerShell -Command "rm commands/**/*.js"'
            : 'rm commands/**/*.js',
          'npx tsc'
        ]
      },
      {
        name: 'Reloading all commands...',
        async run() {
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
