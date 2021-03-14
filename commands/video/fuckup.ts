import { Message, MessageOptions } from 'discord.js'
import Ffmpeg from "fluent-ffmpeg"
import fetch from "node-fetch"
import { createReadStream } from "node:fs"
import { Readable } from 'stream'


export async function run (message: Message): Promise<MessageOptions> {
  return new Promise(async (resolve, reject) => {
    message.channel.startTyping()
    const attachment = message.attachments.first()
    if (!attachment) {
      return {
        embed: {
          color: 'RED',
          title: 'Oops!',
          description: 'you kinda fuckin need an attachment'
        }
      }
    }
    const buffer = await fetch(attachment.attachment as string).then(res => res.buffer())
    const readable = new Readable()
    readable._read = () => { } // _read is required but you can noop it
    readable.push(buffer)
    readable.push(null)

    const location = process.platform === 'win32' ? process.env.TEMP! + '\\' + Math.random() + '.mp4' : '/tmp/' + Math.random() + '.mp4'
    Ffmpeg(readable)
      .videoBitrate(5)
      .audioBitrate(20)
      .FPS(5)
      .on('error', reject)
      .on('end', () => {
        message.channel.stopTyping()
        resolve({
          files: [{
            name: 'vid.mp4',
            attachment: createReadStream(location)
          }]
        })
      })
      .saveToFile(location)
  })
}
export const help = 'send a video and trollsmile will destroy it'
export const aliases = []
