import { dayOfYear } from './date'

export type Quote = {
  text: string
  author: string
}

// Curated for wisdom + ambition. No generic platitudes.
export const QUOTES: Quote[] = [
  // Naval — leverage, specific knowledge, long games
  { text: "Earn with your mind, not your time.", author: "Naval Ravikant" },
  { text: "Play long-term games with long-term people.", author: "Naval Ravikant" },
  { text: "Specific knowledge is found by pursuing your genuine curiosity.", author: "Naval Ravikant" },
  { text: "Leverage is a force multiplier for your judgment.", author: "Naval Ravikant" },
  { text: "All the returns in life — wealth, relationships, knowledge — come from compound interest.", author: "Naval Ravikant" },

  // Munger / Buffett — patience, inversion, compounding
  { text: "It's not about the money. It's about the compounding of good decisions.", author: "Charlie Munger" },
  { text: "Invert, always invert. Turn a problem upside down.", author: "Charlie Munger" },
  { text: "The big money is not in the buying or the selling, but in the waiting.", author: "Charlie Munger" },
  { text: "Someone's sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett" },
  { text: "The most important investment you can make is in yourself.", author: "Warren Buffett" },

  // Paul Graham — focus, depth, doing
  { text: "You've got to be willing to fail, to be miserable, to put in the hours.", author: "Paul Graham" },
  { text: "The most productive people share the same focus: fewer projects, deeper work.", author: "Paul Graham" },
  { text: "What you can do, or dream you can, begin it.", author: "Paul Graham" },

  // Sam Altman / Reid Hoffman / Jensen — builder energy
  { text: "The best way to predict the future is to build it.", author: "Sam Altman" },
  { text: "Relentless resourcefulness beats talent every time.", author: "Sam Altman" },
  { text: "An entrepreneur is someone who will work 80 hours a week to avoid working 40.", author: "Reid Hoffman" },
  { text: "Greatness comes from character, and character isn't formed out of smart people. It's formed out of people who suffered.", author: "Jensen Huang" },

  // Derek Sivers — focus, depth
  { text: "Don't be a donkey. Pick one thing and go deep.", author: "Derek Sivers" },
  { text: "If more information was the answer, we'd all be billionaires with perfect abs.", author: "Derek Sivers" },

  // Stoics — Aurelius, Seneca, Epictetus
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "You have power over your mind — not outside events. Realise this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "A gem cannot be polished without friction, nor a man perfected without trials.", author: "Seneca" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "First say to yourself what you would be; then do what you have to do.", author: "Epictetus" },

  // James Clear — systems, identity
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
  { text: "The costs of your bad habits are in the future. The costs of your good habits are in the present.", author: "James Clear" },
  { text: "Identity change is the north star of habit change.", author: "James Clear" },

  // Bruce Lee, Schopenhauer, Spartan
  { text: "Do not pray for an easy life; pray for the strength to endure a difficult one.", author: "Bruce Lee" },
  { text: "Absorb what is useful, discard what is useless, add what is essentially your own.", author: "Bruce Lee" },
  { text: "Talent hits a target no one else can hit. Genius hits a target no one else can see.", author: "Arthur Schopenhauer" },
  { text: "Sweat more in practice, bleed less in war.", author: "Ancient Spartan proverb" },
  { text: "Greatness is not a function of circumstance. It is largely a matter of conscious choice and discipline.", author: "Jim Collins" },
]

export function getQuoteOfDay(date?: Date): Quote {
  const d = date ?? new Date()
  const idx = dayOfYear(d) % QUOTES.length
  return QUOTES[idx]
}
