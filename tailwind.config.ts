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
        // ── Canopea 2.0 — Paleta tecnológica formal ──────────────────────
        // Primary (de oscuro a claro)
        'rich-black':   '#030D09',   // fondo principal
        'dark-green':   '#032221',   // bg-mid / superficie baja
        'bangladesh':   '#03624C',   // superficie media
        'meadow':       '#2CC295',   // acento secundario / hover
        'caribbean':    '#00DF81',   // acento principal (verde brillante)
        'anti-white':   '#F1F7F6',   // texto primario

        // Secondary
        pine:           '#06302B',   // bg-dark alternativo
        basil:          '#0B453A',   // superficie / borde
        forest:         '#095544',   // borde / divisor
        frog:           '#17876D',   // acento terciario
        mint:           '#2FA98C',   // acento hover suave
        stone:          '#707D7D',   // texto terciario / deshabilitado
        pistachio:      '#AAC8C4',   // texto secundario

        // Alias semánticos (compatibilidad con código existente)
        lime:           '#00DF81',   // → caribbean
        cyan:           '#2CC295',   // → meadow
        teal:           '#17876D',   // → frog
        olive:          '#095544',   // → forest
        charcoal:       '#707D7D',   // → stone

        'lime-light':   '#2CC295',
        'cyan-dark':    '#17876D',
        'olive-light':  '#2FA98C',
        'teal-light':   '#2FA98C',
        'teal-dark':    '#032221',

        // Backgrounds
        'bg-dark':      '#030D09',
        'bg-mid':       '#032221',
        surface:        '#0B453A',   // cards / panels

        // Borders
        'border-green': '#095544',   // divisores

        // Text
        text:           '#F1F7F6',
        text2:          '#AAC8C4',
        text3:          '#707D7D',
      },
      fontFamily: {
        sans:    ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-up':   'slideUp 0.7s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
