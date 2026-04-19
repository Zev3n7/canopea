import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Canopea (Adobe Color: Tidy Green Clean)
        charcoal:  '#565859',
        olive:     '#4F7001',
        lime:      '#84BD01',
        cyan:      '#0DD2EA',
        teal:      '#265157',
        // Extendidas para UI
        'olive-light':  '#7FA832',
        'teal-light':   '#3A7580',
        'teal-dark':    '#162E32',
        'lime-light':   '#B5D94C',
        'cyan-dark':    '#0A9BAF',
        'bg-dark':      '#0D1710',
        'bg-mid':       '#111E14',
        'bg-surface':   '#172319',
        'border-green': '#1E3520',
      },
      fontFamily: {
        sans:  ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-geist-mono)', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-up':   'slideUp 0.7s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glow:    { from: { textShadow: '0 0 10px #84BD01' }, to: { textShadow: '0 0 30px #84BD01, 0 0 60px #0DD2EA' } },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%231E3520' stroke-width='0.5'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
