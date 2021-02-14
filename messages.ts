// add more
interface Nested<Type> {
  [key: string]: Nested<Type> | Type[]
}

const messages: Nested<string> = {
  Browsers: {
    Chromium: [
      'Google Chrome',
      'Opera GX', // funny meme
      'Microsoft Edge'
    ],
    Other: [
      'Mozilla Firefox',
      'Microsoft Internet Explorer',
      'Netscape Navigator'
    ]
  },
  'Operating Systems': {
    Linux: [
      'Ubuntu',
      'KDE neon', // kde users when they see a lawn gnome in their neighbor's yard
      'Arch Linux',
      'SteamOS',
      'Hannah Montana Linux' // The one true Linux distro.
    ],
    Windows: [
      '10',
      '7',
      'Vista',
      'XP',
      '95',
      '3.1'
    ].map(str => `Windows ${str}`)
  },
  Apps: [
    // Apps are programs on mobile
    'TikTok',
    'iPod Music'
  ],
  Programs: [
    // Programs are apps on PC
    'MS Paint',
    'Skype', // Communication tool for free calls and chat
    'Blender', // The free and open source 3D creation suite.
    'AOL Instant Messenger',
    'Visual Studio Code', // Visual Studio without the Visual
    'Atom', // A hackable text editor for the 21st Century
    'Shotcut', // Free, open source, and cross-platform video editor.
    'foobar2000',
    'XMPlay',
    'OpenMPT'
  ],
  Nintendo: {
    Wii: [
      'Wii Speak Channel',
      'Wii Shop Channel',
      'Internet Channel',
      'Photo Channel',
      'Mii Channel',
      'Disc Channel'
    ],
    Switch: ['Super Mario Maker 2', 'Super Smash Bros. Ultimate'],
    Other: [
      'Yoshi for the NES',
      'Nintendo™',
      'Game Boy Advance Video',
      'Wario World',
      'Mario'
    ],
    Mobile: [
      'Super Mario Run',
      'Miitomo',
      'Pokémon GO',
      'Animal Crossing: Pocket Camp',
      'Nintendo Switch Online',
      'Dr. Mario World'
    ]
  },
  Meta: [
    // References to bots (or this bot)
    '700+ commits!',
    'NotSoBot is bad™',
    'Updates commands without restarting!',
    'Minecraft', // trollsmile-minecraft
    'Roblox', // trollsmile-roblox
    'with 500 MB of RAM and storage'
  ],
  Songs: Object.entries({
    'Scatman John': ["Scatman's World"],
    'Alex Arcoleo': ['Bloom 7'],
    'Neil Cicierega': ['Wow Wow', 'The Starting Line'],
    'Big Shaq': ["Man Don't Dance", 'Mans Not Hot'],
    TOPAZ: [
      // topazzz.bandcamp.com to be exact
      'Half Awake, Pt. 2',
      'Half Awake, Pt. 1'
    ],
    'Fatty Spins': [
      "Doin' Your Mom" // you know we straight
    ],
    'FAT DAMON': ['Conspiracy Theory Guy'],
    'Your Favorite Martian': ["Grandma's Got A Facebook", "STALKIN' YOUR MOM"],
    'Post Malone': ['I Know']
  })
    .map(([author, songs]) => songs.map(title => `${author} - ${title}`))
    .flat(), // Turn this object into a string[] of 'Author - Song' names
  Games: [
    // Finally, the actual games lmao
    'Pac-Man Championship Edition DX+',
    'Yandere Simulator',
    'Pac-Man Championship Edition 2',
    'Club Penguin',
    'Club Penguin Island',
    'Hong Kong 97',
    "Sonic's Schoolhouse",
    'Desert Bus',
    'Shrek Extra Large', // Somehow a real game.
    'Super Bernie World', // Yes this is too
    'Skyrim',
    'SuperTuxKart',
    'Sonic 06',
    'Metal Gear Solid 4',
    'Action 52',
    'Animal Crossing: New Horizons',
    'Meme Run',
    'Super Monkey Ball 3'
  ],
  'Fake Games': [
    'Hello Kitty Island Adventure',
    'FL Studio: SoundCloud Rapper Edition',
    'Fake Download Button Simulator',
    'Funny Fortain',
    'Battletoads for Wii',
    'Fortnut', // i mean kinda
    'The Elder Scrolls 6', // Not yet
    'Mega Man Legends 3',
    'BLJ Simulator'
  ],
  Puns: [
    'with recursion', // haha get it v6
    'with your sanity',
    'with yo mama',
    'with a broken god',
    'with Brody Foxx',
    'with GIFs',
    'games with the mortals',
    'yourself',
    'with your Discord server',
    'with a stone, Luigi.'
  ],
  'esmBot Random': [
    // All of these are from esmBot.
    'h',
    'a game',
    'anime',
    'absolutely nothing',
    'epic mashups bro',
    'Jake Paul videos on repeat',
    'gniyalꟼ',
    'the Cat Piano',
    'HaaH WaaW',
    'dQw4w9WgXcQ', // never gonna give you up
    'the funny memes epic',
    'Bottom Text',
    'lol 7',
    'Family Guy',
    'yeah',
    'Rofa Cat',
    'jeff',
    'woo yeah',
    'joe mama',
    '#BringBackNationalSex',
    'the',
    'sissy hypnosis',
    'PogChamp',
    'sentience',
    'beep boop',
    'Hello, Gordon!',
  ],
  'trollsmile random': [ // New messages go here
    'now this is a j',
    "Season X is here, and the world is destabilising, fast. But, don’t worry, that means there are a ton of new ways to play Fortnite",
    'linux tux funny',
    'bruh beagle real',
    'ugly beagle is ugly'
  ]
}

const flatten = <Type> (messages: Nested<Type> | Type[]): Type[] => {
  const result = Object.values(messages)
    .map(val => Array.isArray(val) ? val : Object.values(val).flat())
    .flat()

  return result.some(Array.isArray) ? flatten(result) : result
}

const all = flatten(messages)

export { messages, all }
