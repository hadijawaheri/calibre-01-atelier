import type { PhotoCredit, SourceLink } from "@/components/atlas";
import type { CalibreFamily } from "@/features/movement/calibres";

/** A freely licensed photograph from Wikimedia Commons, credited under its plate. */
export interface ReferencePhoto {
  src: string;
  alt: string;
  caption: string;
  credit: PhotoCredit;
}

/** One measured or dated fact. A Latin value (a reference, vph) is set in the mono. */
export interface ReferenceSpec {
  label: string;
  value: string;
  latin?: boolean;
}

export interface BrandEntry {
  slug: string;
  name: string;
  latinName: string;
  /** The year the house dates itself from; the directory is ordered by it. */
  founded: number;
  place: string;
  founders?: string;
  /** Who owns the house today, when the sources say so. */
  owner?: string;
  summary: string;
  /** The brand's long read on the history page, when it has one. */
  historySlug?: string;
  sources: readonly SourceLink[];
}

export interface WatchEntry {
  slug: string;
  brandSlug: string;
  name: string;
  latinName: string;
  /** The year the model was introduced; the catalogue is ordered by it. */
  year: number;
  specs: readonly ReferenceSpec[];
  story: string;
  /** The catalogue entry of the calibre inside, when it has one. */
  calibreSlug?: string;
  photo?: ReferencePhoto;
  sources: readonly SourceLink[];
}

export type CalibreKind = "manual" | "automatic" | "chronograph" | "quartz";

export interface CalibreEntry {
  slug: string;
  name: string;
  maker: string;
  kind: CalibreKind;
  /** Persian description of how it is wound and what it shows. */
  type: string;
  /** The year it was introduced, when a source dates it. */
  year?: number;
  frequency?: string;
  powerReserve?: string;
  jewels?: string;
  diameter?: string;
  height?: string;
  note: string;
  /** The lab family it belongs to, so the page can lead into the 3D lab. */
  family?: CalibreFamily;
  photo?: ReferencePhoto;
  sources: readonly SourceLink[];
}
