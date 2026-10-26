export const paths = {
  home: "/",
  lab: "/lab",
  history: "/history",
  brands: "/brands",
  watches: "/watches",
  calibres: "/calibres",
  labCalibre: (slug: string) => `/lab/${slug}`,
} as const;
