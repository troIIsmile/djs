import { Message, MessageOptions } from 'discord.js'
import { createRequire } from 'module'
import fetch from 'node-fetch'
const require = createRequire(import.meta.url)
const { validateURL, getInfo, chooseFormat } = require('ytdl-core')

export const run = async (
  message: Message,
  args: string[]
): Promise<MessageOptions> => {
  if (false) {
    // ytdl-core currently disabled
    const info = await getInfo(args.join(' '))
    const vid = chooseFormat(info.formats, {
      filter: 'audioandvideo',
      quality: 'highest'
    })
    return vid
      ? {
          embed: {
            title: info.videoDetails.title,
            author: {
              name: info.videoDetails.ownerChannelName,
              url: info.videoDetails.ownerProfileUrl
            },
            url: vid.url,
            description: 'Click the above link to download.'
          }
        }
      : {
          embed: {
            title: "we couldn't find a video with video lol",
            description: 'fuc kyou',
            color: 'RED'
          }
        }
  } else {
    const video = await fetch(
      `https://projectlounge.pw/ytdl/download?url=${encodeURIComponent(
        args.join(' ')
      )}`
    ).then((res) => res.buffer())
    return {
      embed: {
        title: 'Click here if the video is not displayed.',
        url: `https://projectlounge.pw/ytdl/download?url=${encodeURIComponent(
          args.join(' ')
        )}`
      },
      files:
        video.length <= 8388608
          ? [
              {
                attachment: video,
                name: 'video.mp4'
              }
            ]
          : undefined
    }
  }
}

export const help = 'download video,,,'
