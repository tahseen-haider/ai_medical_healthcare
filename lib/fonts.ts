// lib/fonts.ts
import localFont from "next/font/local";
// Ubuntu
export const ubuntu = localFont({
  src: [
    {
      path: "../public/fonts/Ubuntu-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Ubuntu-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Ubuntu-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ubuntu", // optional for CSS variables
  display: "swap",
});

// Roboto
export const roboto = localFont({
  src: [
    {
      path: "../public/fonts/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});
