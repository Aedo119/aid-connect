// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2dd4bf", // teal-400
          dark: "#14b8a6",    // teal-500
          light: "#ccfbf1",   // teal-50
        },
        boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.08)", // soft, clean shadow
      },
        accent: {
          DEFAULT: "#fda4af", // rose-300
          light: "#fff1f2",   // rose-50
        },
      },
    },
  },
  plugins: [],
};
