import localFont from "next/font/local";

// Self-hosted: Google Fonts is unreliable from servers inside Iran
export const vazirmatn = localFont({
  src: "../../assets/fonts/vazirmatn-variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

export const cormorant = localFont({
  src: [
    { path: "../../assets/fonts/cormorant-garamond-variable.woff2", style: "normal" },
    { path: "../../assets/fonts/cormorant-garamond-variable-italic.woff2", style: "italic" },
  ],
  variable: "--font-cormorant",
  weight: "300 700",
  display: "swap",
});

export const jetbrains = localFont({
  src: [
    { path: "../../assets/fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../../assets/fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});
