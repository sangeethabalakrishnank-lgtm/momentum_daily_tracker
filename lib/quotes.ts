import { dayOfYear } from './date'

export type Quote = {
  text: string
  author: string
  theme: 'ambition' | 'discipline' | 'long-game' | 'craft'
}

export const QUOTES: Quote[] = [
  // ambition
  { text: "Earn with your mind, not your time.", author: "Naval Ravikant", theme: "ambition" },
  { text: "Specific knowledge cannot be taught, but it can be learned.", author: "Naval Ravikant", theme: "ambition" },
  { text: "The most important investment you can make is in yourself.", author: "Warren Buffett", theme: "ambition" },
  { text: "Someone's sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett", theme: "long-game" },
  { text: "It's not about the money. It's about the compounding of good decisions.", author: "Charlie Munger", theme: "long-game" },
  { text: "Invert, always invert. Turn a problem upside down.", author: "Charlie Munger", theme: "craft" },
  { text: "You've got to be willing to fail, to be miserable, to put in the hours.", author: "Paul Graham", theme: "ambition" },
  { text: "The only way to get good at something is to practice it relentlessly.", author: "Paul Graham", theme: "discipline" },
  { text: "Don't be a donkey. Pick one thing and go deep.", author: "Derek Sivers", theme: "discipline" },
  { text: "Slow is smooth, smooth is fast. The fundamentals compound.", author: "Derek Sivers", theme: "long-game" },
  { text: "The best way to predict the future is to build it.", author: "Sam Altman", theme: "ambition" },
  { text: "Relentless resourcefulness beats talent every time.", author: "Sam Altman", theme: "craft" },
  { text: "In the long run, your network is your net worth.", author: "Reid Hoffman", theme: "ambition" },
  { text: "An entrepreneur is someone who will work 80 hours a week to avoid working 40.", author: "Reid Hoffman", theme: "ambition" },
  { text: "The only thing worse than working for a bad company is working for a mediocre one.", author: "Jensen Huang", theme: "ambition" },
  { text: "I would rather have questions that can't be answered than answers that can't be questioned.", author: "Richard Feynman", theme: "craft" },
  { text: "Leverage is a force multiplier for your judgment.", author: "Naval Ravikant", theme: "ambition" },
  { text: "Play long-term games with long-term people.", author: "Naval Ravikant", theme: "long-game" },
  { text: "The most productive people share the same focus: fewer projects, deeper work.", author: "Paul Graham", theme: "discipline" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", theme: "discipline" },
  // discipline
  { text: "We suffer more in imagination than in reality.", author: "Seneca", theme: "discipline" },
  { text: "Dwell on the beauty of life. Watch the stars and see yourself running with them.", author: "Marcus Aurelius", theme: "discipline" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius", theme: "discipline" },
  { text: "You have power over your mind, not outside events. Realise this, and you will find strength.", author: "Marcus Aurelius", theme: "discipline" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius", theme: "ambition" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca", theme: "discipline" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca", theme: "long-game" },
  { text: "A gem cannot be polished without friction, nor a man perfected without trials.", author: "Seneca", theme: "discipline" },
  // long-game / craft
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear", theme: "long-game" },
  { text: "The costs of your bad habits are in the future. The costs of your good habits are in the present.", author: "James Clear", theme: "long-game" },
  { text: "Success is the product of daily habits, not once-in-a-lifetime transformations.", author: "James Clear", theme: "discipline" },
  { text: "Professionals stick to the schedule. Amateurs let life get in the way.", author: "James Clear", theme: "discipline" },
  { text: "Identity change is the north star of habit change.", author: "James Clear", theme: "long-game" },
  { text: "Make the most of yourself, for that is all there is of you.", author: "Ralph Waldo Emerson", theme: "ambition" },
  { text: "Do not pray for an easy life; pray for the strength to endure a difficult one.", author: "Bruce Lee", theme: "discipline" },
  { text: "Absorb what is useful, discard what is useless, add what is essentially your own.", author: "Bruce Lee", theme: "craft" },
  { text: "Sweat more in practice, bleed less in war.", author: "Ancient Spartan proverb", theme: "discipline" },
  { text: "The price of excellence is discipline. The cost of mediocrity is disappointment.", author: "William Arthur Ward", theme: "craft" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma", theme: "long-game" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", theme: "craft" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", theme: "long-game" },
  { text: "Iron rusts from disuse, water loses its purity from stagnation. Even so does inaction sap the vigour of the mind.", author: "Leonardo da Vinci", theme: "discipline" },
  { text: "Work is the master key that opens the door to all opportunities.", author: "Jim Rohn", theme: "craft" },
  { text: "Take care of the minutes, and the hours will take care of themselves.", author: "Lord Chesterfield", theme: "discipline" },
  { text: "You don't find time, you make it.", author: "Unknown", theme: "craft" },
  { text: "First master the fundamentals.", author: "Larry Bird", theme: "craft" },
  { text: "Talent hits a target no one else can hit. Genius hits a target no one else can see.", author: "Arthur Schopenhauer", theme: "ambition" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", theme: "ambition" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali", theme: "discipline" },
  { text: "Greatness is not a function of circumstance. It is largely a matter of conscious choice and discipline.", author: "Jim Collins", theme: "long-game" },
]

export function getQuoteOfDay(date?: Date): Quote {
  const d = date ?? new Date()
  const idx = dayOfYear(d) % QUOTES.length
  return QUOTES[idx]
}
