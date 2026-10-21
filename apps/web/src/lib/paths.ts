export const paths = {
  home: "/",
  lab: "/lab",
  labCalibre: (slug: string) => `/lab/${slug}`,
} as const;
