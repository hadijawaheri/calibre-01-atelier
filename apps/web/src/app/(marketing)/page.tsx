import {
  AtelierCraft,
  CalibreStory,
  CollectionsStrip,
  FeaturedWatches,
  Hero,
  Services,
} from "@/features/marketing";
import { listFeaturedProducts } from "@/features/products/api";

export default async function HomePage() {
  // The page stays up when the API is down; only the featured strip degrades
  const featured = await listFeaturedProducts(3).catch(() => null);
  return (
    <>
      <Hero />
      <FeaturedWatches products={featured} />
      <CalibreStory />
      <CollectionsStrip />
      <AtelierCraft />
      <Services />
    </>
  );
}
