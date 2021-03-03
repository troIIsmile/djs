import { ActivityType } from "discord.js"

// add more
interface Nested<Type> {
  [key: string]: Nested<Type> | Type[]
}

const listening: Nested<string> = {
  LOL: [
    'esmBot users whine',
    'Molly crying',
  ],
  Songs: Object.entries({
    'Scatman John': ["Scatman's World"],
    'Alex Arcoleo': ['Bloom 7'],
    'Neil Cicierega': ['Wow Wow', 'The Starting Line'],
    'Lil Nas X': [
      'Montero (Call Me By Your Name)',
      'funny horse song'
    ],
    deadmau5: [
      'Bridged By A Lightwave',
      'Glivch',
      'Are You Not Afraid',
      'minecraft skin with ear,, how'
    ],
    'Diamond Eyes': ['Everything'],
    trollsmile: [
      'trollsmile admin welcome sound 10 hour loop',
      'trollsmile winning (feat. LuaQuack)',
      'trollsmile on top (feat. the troiismile Roblox account)'
    ],
    'Fatty Spins': [
      "Doin' Your Mom" // you know we straight
    ],
    "Nero's Day At Disneyland": [
      "In Aisles",
      "Civilizing People",
      "No Money Down, Low Monthly Payments",
      "Child Protective Services Theme Song",
      "Charging Swarm Of Mouseketeers",
      "Everything Must Go",
      "Death Parade Feat. Kevin Shields",
      "Action Winter Journey",
      "Stretched Linen Over Contorted Bodies",
      "Eulogy For Nick Galvas",
      "In Keyed Fantasy",
      "Probably End Up Dead In A Ditch Somewhere",
      "Plumes Of ATM Sinew",
      "Vengeance In Cloudland",
      "Swarming Idiot Effigy"
    ]
  })
    .map(([author, songs]) => songs.map(title => `${author} - ${title}`))
    .flat(), // Turn this object into a string[] of 'Author - Song' names
}

const competing: Nested<string> = {
  Other: [
    'moller competition',
    'a Dream video'
  ]
}

const flatten = <Type> (messages: Nested<Type> | Type[]): Type[] => {
  const result = Object.values(messages)
    .map(val => Array.isArray(val) ? val : Object.values(val).flat())
    .flat()

  return result.some(Array.isArray) ? flatten(result) : result
}

interface TrollsmileLine { line: string, type: ActivityType }

function to_line (lines: string[], type: ActivityType): TrollsmileLine[] {
  return lines.map(line => ({
    line,
    type
  }))
}
const all: TrollsmileLine[] = [
  ...to_line(flatten(listening), 'LISTENING'),
  ...to_line(flatten(competing), 'COMPETING')
]

export { listening as messages, all }
