/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#131313',
        slate: '#2d2d2d',
        mint: '#3cffd0',
        mintBorder: '#309875',
        ultraviolet: '#5200ff',
        purpleRule: '#3d00bf',
        hazardWhite: '#ffffff',
        linkBlue: '#3860be',
        focusCyan: '#1eaedb',
        secondary: '#949494',
        muted: '#e9e9e9',
        inverted: '#131313',
        tileYellow: '#fff200',
        tilePink: '#ff70a6',
        tileOrange: '#ff8800',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Anton', 'Impact', 'sans-serif'],
        sans: ['"Space Grotesk"', 'Helvetica', 'sans-serif'],
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
      },
      borderRadius: {
        tag: '2px',
        img: '3px',
        xs: '4px',
        pill: '20px',
        card: '24px',
        promo: '30px',
        cta: '40px',
      },
      lineHeight: {
        display: '0.95',
      },
      letterSpacing: {
        kicker: '0.08em',
      },
    },
  },
  plugins: [],
}
