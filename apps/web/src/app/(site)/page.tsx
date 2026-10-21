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
  MovementFlight,
  SmoothScroll,
} from "@/features/home";

export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <MovementFlight />
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
