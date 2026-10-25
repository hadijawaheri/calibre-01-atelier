import localFont from "next/font/local";

// Self-hosted: Google Fonts is unreliable from servers inside Iran

// Persian text: the Arabic-script cut of the same family as the Latin text, so the two scripts share one voice
export const plexArabic = localFont({
  src: [
    { path: "../../assets/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400" },
    { path: "../../assets/fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500" },
    { path: "../../assets/fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const plexSans = localFont({
  src: "../../assets/fonts/ibm-plex-sans-latin-wght-normal.woff2",
  variable: "--font-plex-sans",
  weight: "100 700",
  display: "swap",
});

// Figures, references and measurements: the atlas sets its data in a monospace
export const plexMono = localFont({
  src: [
    { path: "../../assets/fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../../assets/fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const cormorant = localFont({
  src: [
    { path: "../../assets/fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400" },
    { path: "../../assets/fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500" },
    { path: "../../assets/fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

// The Persian counterpart of the Garamond: a classical Naskh with real thick and thin strokes
export const amiri = localFont({
  src: "../../assets/fonts/amiri-arabic-400.woff2",
  variable: "--font-amiri",
  weight: "400",
  display: "swap",
});
