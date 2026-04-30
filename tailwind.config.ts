import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:     '#0a0a0a',
        surface:        '#111111',
        border:         '#1e1e1e',
        'border-muted': '#222222',
        foreground:     '#ffffff',
        muted:          '#555555',
        'muted-2':      '#444444',
        'muted-3':      '#333333',
      },
      fontFamily: { mono: ['var(--font-mono)', 'monospace'] },
    },
  },
  plugins: [],
}
export default config
