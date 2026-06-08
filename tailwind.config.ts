import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        coral: "#e75d50",
        palm: "#14746f",
        mist: "#f4f7f5"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(31, 41, 51, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
