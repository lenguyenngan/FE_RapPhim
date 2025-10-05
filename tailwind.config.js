/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out both",
        "fadeUpDelay-100": "fadeUp 0.8s ease-out 0.1s both",
        "fadeUpDelay-200": "fadeUp 0.8s ease-out 0.2s both",
        "fadeUpDelay-300": "fadeUp 0.8s ease-out 0.3s both",
        "fadeUpDelay-400": "fadeUp 0.8s ease-out 0.4s both",
        "fadeUpDelay-500": "fadeUp 0.8s ease-out 0.5s both",
      },
    },
  },

  plugins: [],
};
