import type {
  CaseMaterial,
  Collection,
  DialLayout,
  MovementType,
  StrapOption,
} from "@kronos/contracts";
import { CASE_MATERIALS, COLLECTIONS, DIAL_LAYOUTS, MOVEMENT_TYPES } from "@kronos/contracts";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";

import { softDeletePlugin } from "../../../common/database/soft-delete.plugin.js";

@Schema({ timestamps: true })
export class Product {
  _id!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  slug!: string;

  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: String, required: true, trim: true })
  nameEn!: string;

  @Prop({ type: String, required: true, trim: true })
  reference!: string;

  @Prop({ type: String, enum: COLLECTIONS, required: true })
  series!: Collection;

  @Prop({ type: String, default: "" })
  tagline!: string;

  @Prop({ type: String, required: true })
  description!: string;

  /** Rial, integer */
  @Prop({ type: Number, required: true, min: 0 })
  price!: number;

  @Prop({ type: Number, required: true, min: 0 })
  stock!: number;

  @Prop({ type: Number, default: null })
  editionSize!: number | null;

  @Prop(
    raw({
      type: { type: String, enum: MOVEMENT_TYPES, required: true },
      calibre: { type: String, required: true },
      frequencyVph: { type: Number, required: true },
      jewels: { type: Number, required: true },
      powerReserveHours: { type: Number, required: true },
    }),
  )
  movement!: {
    type: MovementType;
    calibre: string;
    frequencyVph: number;
    jewels: number;
    powerReserveHours: number;
  };

  @Prop(
    raw({
      material: { type: String, enum: CASE_MATERIALS, required: true },
      diameterMm: { type: Number, required: true },
      thicknessMm: { type: Number, required: true },
      waterResistanceM: { type: Number, required: true },
    }),
  )
  case!: {
    material: CaseMaterial;
    diameterMm: number;
    thicknessMm: number;
    waterResistanceM: number;
  };

  @Prop(
    raw({
      dial: { type: String, required: true },
      accent: { type: String, required: true },
      layout: { type: String, enum: DIAL_LAYOUTS, required: true },
    }),
  )
  appearance!: { dial: string; accent: string; layout: DialLayout };

  @Prop({
    type: [
      {
        _id: false,
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    default: [],
  })
  straps!: StrapOption[];

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: [String], default: [] })
  highlights!: string[];

  @Prop({ type: Boolean, default: false })
  isFeatured!: boolean;

  @Prop({ type: Boolean, default: false })
  isPublished!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date | null;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(softDeletePlugin);
ProductSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
ProductSchema.index({ isPublished: 1, series: 1, price: 1 });
ProductSchema.index({ isPublished: 1, isFeatured: -1, createdAt: -1 });
