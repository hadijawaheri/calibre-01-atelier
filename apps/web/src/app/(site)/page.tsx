import {
  HomeBlueprint,
  HomeFamilies,
  HomeFeatures,
  HomeFinale,
  HomeGallery,
  HomeHero,
  HomeStatement,
  HomeTimegrapher,
  MovementFilm,
} from "@/features/home";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeStatement />
      <MovementFilm />
      <HomeFeatures />
      <HomeGallery />
      <HomeTimegrapher />
      <HomeBlueprint />
      <HomeFamilies />
      <HomeFinale />
    </>
  );
}
