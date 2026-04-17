import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: {
      center: true,
      padding: "0rem",
      margin: "0rem",
      screens: {
        DEFAULT: "65rem",
      },
    },
    extend: {
      animation: {
        sliding: "sliding 30s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      fontSize: {
        "xxs": ["0.625rem", "1rem"], /* 10px */
        "xs": ["0.75rem", "0.9rem"], /* 12px */
        "sm": ["0.875rem", "1.05rem"], /* 14px */
        "base": ["1rem", "1.5rem"], /* 14px */
        "2.5xl": ["1.75rem", "2.31rem"], /* 28px */
        "3.5xl": ["2.125rem", "2.5rem"], /* 34px */
        "4xl": ["2.25rem", "3.15rem"], /* 36px */
      },
      padding: {
        "5.5": "1.375rem", /* 22px */
        "6.5": "1.625rem", /* 26px */
        "7.5": "1.875rem", /* 30px */
        "8.75": "2.188rem", /* 35px */
        "11.25": "2.813rem", /* 45px */
        "13": "3.375rem", /* 54px */
        "13.5": "3.5rem", /* 56px */
        "15": "3.75rem", /* 60px */
        "16.5": "4.125rem", /* 66px */
        "17.5": "4.375rem", /* 70px */
        "18.5": "4.875rem", /* 78px */
        "22.5": "5.625rem", /* 90px */
        "26": "6.5rem", /* 104px */
        "30": "7.5rem", /* 120px */
        "44.5": "11.25rem", /* 180px */
        "1/10": "10%",
        "18/10": "18%",
      },
      margin: {
        "4.5": "1.125rem", /* 18px */
        "5.5": "1.375rem", /* 22px */
        "6.5": "1.625rem", /* 26px */
        "7.5": "1.875rem", /* 30px */
        "8.75": "2.188rem", /* 35px */
        "11.25": "2.813rem", /* 45px */
        "11.5": "2.875rem", /* 46px */
        "15": "3.75rem", /* 60px */
        "17.5": "4.375rem", /* 70px */
        "22.5": "5.625rem", /* 90px */
        "26": "6.5rem", /* 104px */
        "71": "17rem", /* 272px */
        "85": "21.25rem", /* 272px */
        "1/10": "10%",
      },
      height: {
        "10.5": "2.625rem", /* 42px */
        "12.5": "3.125rem", /* 50px */
      },
      minHeight: {
        "10.5": "2.625rem", /* 42px */
      },
      maxHeight: {
        "10.5": "2.625rem", /* 42px */
      },
      borderWidth: {
        xs: "1.5px",
      },
      inset: {
        "3/10": "30%",
        "h-screen": "100vh",
      },
    },
  },
};
