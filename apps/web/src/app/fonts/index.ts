import localFont from "next/font/local";

// Self-hosted: Google Fonts is unreliable from servers inside Iran
export const vazirmatn = localFont({
  src: "../../assets/fonts/vazirmatn-variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

// Latin text: a geometric sans beside the didone, as in the watch houses' own catalogues
export const jost = localFont({
  src: "../../assets/fonts/jost-latin-variable.woff2",
  variable: "--font-jost",
  weight: "100 900",
  display: "swap",
});

export const bodoni = localFont({
  src: "../../assets/fonts/bodoni-moda-latin-variable.woff2",
  variable: "--font-bodoni",
  weight: "400 900",
  display: "swap",
});

// The Persian counterpart of the didone: a classical Naskh with real thick and thin strokes
export const amiri = localFont({
  src: "../../assets/fonts/amiri-arabic-400.woff2",
  variable: "--font-amiri",
  weight: "400",
  display: "swap",
});
