import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-yellow": "#FED700",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("daisyui"),
    heroui(),
  ],
  daisyui: {
    prefix: "daisy-", // Prefixes all DaisyUI classes
    themes: ["light", "dark"], // Your themes
  },
};
export default config;
