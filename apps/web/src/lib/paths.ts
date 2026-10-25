export const paths = {
  home: "/",
  lab: "/lab",
  history: "/history",
  labCalibre: (slug: string) => `/lab/${slug}`,
} as const;
