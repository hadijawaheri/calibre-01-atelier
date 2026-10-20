import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

@Schema({ timestamps: false })
export class Otp {
  @Prop({ type: String, required: true, unique: true })
  mobile!: string;

  @Prop({ type: String, required: true })
  codeHash!: string;

  @Prop({ type: Date, required: true })
  sentAt!: Date;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Number, default: 0 })
  attempts!: number;
}

export type OtpDocument = HydratedDocument<Otp>;
export const OtpSchema = SchemaFactory.createForClass(Otp);
// Kept a little past expiry so the resend cooldown still sees the record
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });
