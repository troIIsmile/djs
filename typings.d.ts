interface Array<T> {
  random (): T
}
declare module 'google-tts-api' {
  export function getAudioUrl (
    text: string,
    options: {
      lang: string,
      slow: boolean, // speed (number) is changed to slow (boolean)
      host: 'https://translate.google.com', // allow to change the host
    }
  ): string
}


interface UnfluffOut {
  title: string,
  softTitle: string
  date: string
  copyright: string
  author: string[]
  publisher: string
  text: string
  description: string
  tags: string[]
  videos: string[]
  canonicalLink: string
  image?: string
  lang: string
  links: { text: string, href: string }[]
  favicon: string
}

type LazyUnfluff = {
  [key in keyof UnfluffOut]: () => UnfluffOut[key]
}

declare const unfluff: {
  (html: string, lang?: string): UnfluffOut
  lazy (html: string, lang?: string): LazyUnfluff
}

declare module 'unfluff' {
  export = unfluff
}
