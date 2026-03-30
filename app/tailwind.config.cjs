module.exports = {
  content: {
    relative: true,
    files: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
