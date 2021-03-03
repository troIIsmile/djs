import channel46news from 'channel46news'
import { Message } from 'discord.js'
export async function run (message: Message, args: string[]): Promise<string> {
  const [title = '', content = ''] = args.join(' ').split('|')
  return channel46news(title, content)
}
export const help = 'Make a fake article. Use it like title|content.'
export const aliases = ['fakenews', 'channel46', 'channel46news', 'prankarticle']
