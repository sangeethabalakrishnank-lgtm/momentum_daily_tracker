import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          DEFAULT: '#B8D4E8',
          deep: '#7CA8C9',
        },
        lilac: {
          DEFAULT: '#D4C4E8',
          deep: '#A892C9',
        },
        cream: {
          DEFAULT: '#FAF6EE',
          warm: '#F5EFE3',
        },
        ink: {
          DEFAULT: '#2D2D3A',
          soft: '#6B6B7A',
        },
        mist: '#E8E4DC',
        peach: '#F5C9B8',
        mint: '#C4E8D4',
        butter: '#F5E8B8',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
