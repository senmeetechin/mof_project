/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#202833",
        textHead: "#66FCF1",
      },
      fontFamily: {
        fontHead: ['"Lexend"'],
        fontContent: ['"Roboto"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-opentype")],
};
