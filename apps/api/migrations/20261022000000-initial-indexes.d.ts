import type { mongo } from "mongoose";

export function up(db: mongo.Db): Promise<void>;
export function down(db: mongo.Db): Promise<void>;
