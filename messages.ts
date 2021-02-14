// add more
interface Nested<Type> {
  [key: string]: Nested<Type> | Type[]
}

const messages: Nested<string> = {
  LOL: [
    'esmBot users whine',
    'Molly crying',
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

const flatten = <Type> (messages: Nested<Type> | Type[]): Type[] => {
  const result = Object.values(messages)
    .map(val => Array.isArray(val) ? val : Object.values(val).flat())
    .flat()

  return result.some(Array.isArray) ? flatten(result) : result
}

const all = flatten(messages)

export { messages, all }
