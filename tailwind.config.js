/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "creme-vanille": "#FDF6ED",
        "brun-cacao": "#3E3E3E",
        "beige-amande": "#E8D8C3",
        "vert-sauge": "#B4C9B1",
        "ocre-miel": "#D4A373",
        "gris-ardoise": "#7B8C8C",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
}
