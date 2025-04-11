/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FF7A29",
          DEFAULT: "#FF8050",
          dark: "#F53D00",
        },
        secondary: {
          light: "#FFD54F",
          DEFAULT: "#FFCA28",
          dark: "#FFC107",
        },
        accent: {
          green: "#4CAF50",
          red: "#F44336",
          blue: "#2196F3",
        },
        neutral: {
          white: "#FFFFFF",
          light: "#F5F5F5",
          medium: "#616161",
          dark: "#212121",
        },
        text: {
          primary: "#212121",
          secondary: "#757575",
          disabled: "#9E9E9E",
        },
      },
      gradientColorStops: {
        "orange-500": "#FF7A29",
        "yellow-400": "#FFD54F",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(to right, var(--tw-gradient-stops))",
        "secondary-gradient":
          "linear-gradient(to right, var(--tw-gradient-stops))",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
}
