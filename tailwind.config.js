const colors = require('tailwindcss/colors')

module.exports = {
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {opacity: ['disabled', 'hover'],},
  },
  plugins: [],
  theme: {
    colors: {
      "teal-100": "#e6fffa",
      "teal-200": "#b2f5ea", 
      "teal-300": "#008080", 
      "teal-400": "#4fd1c5", 
      "teal-500": "#38b2ac",
      "teal-600": "#319795", 
      "teal-900": "#234e52",
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.amber,
      green: colors.green,
    },
  },
};
