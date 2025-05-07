module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {},
  plugins: [
    require("@tailwindcss/line-clamp"),
    require('@tailwindcss/typography'),
  ],
};
