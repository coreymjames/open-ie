// let plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        thumb: {
          "&::-webkit-slider-thumb": {
            appearance: "none",
            width: "24px",
            height: "24px",
            backgroundColor: "black",
            borderRadius: "50%",
            border: "none",
            transition: "background-color 0.3s",
          },
          "&:hover::-webkit-slider-thumb": {
            backgroundColor: "darkblue",
          },
          "&::-moz-range-thumb": {
            width: "25px" /* Set a specific slider handle width */,
            height: "25px" /* Slider handle height */,
            background: "#04AA6D" /* Green background */,
            cursor: "pointer" /* Cursor on hover */,
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
