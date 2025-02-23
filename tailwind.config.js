/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{vue,js,ts}", "./components/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors: {
        netflix: {
          primary: "#E50914",
          background: "#141414",
          card: "#1E1E1E",
          text: "#FFFFFF",
          textSecondary: "#B3B3B3",
          highlight: "#FFD700",
        },
      },
      fontFamily: {
        'dosis': ['Timmana', 'cursive'],
      },
    },
  },
  plugins: [],
};
