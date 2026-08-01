/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        brand: "#2563EB",
        mint: "#0F766E",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
