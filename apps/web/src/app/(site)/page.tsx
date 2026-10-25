import {
  HomeBlueprint,
  HomeFamilies,
  HomeFeatures,
  HomeFinale,
  HomeGallery,
  HomeHero,
  HomeStatement,
  HomeTimegrapher,
  HomeWrist,
  MovementFilm,
  SmoothScroll,
} from "@/features/home";

export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <HomeHero />
      <HomeStatement />
      <HomeWrist />
      <HomeFeatures />
      <MovementFilm />
      <HomeGallery />
      <HomeTimegrapher />
      <HomeBlueprint />
      <HomeFamilies />
      <HomeFinale />
    </>
  );
}
