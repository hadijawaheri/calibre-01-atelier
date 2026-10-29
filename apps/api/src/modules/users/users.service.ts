import type { Role, UserDto } from "@kronos/contracts";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import type { RefreshTokenDocument } from "../auth/schemas/refresh-token.schema.js";
import { RefreshToken } from "../auth/schemas/refresh-token.schema.js";
import type { ReviewDocument } from "../reviews/schemas/review.schema.js";
import { Review } from "../reviews/schemas/review.schema.js";
import type { UpdateProfileDto } from "./dto/update-profile.dto.js";
import type { UserDocument } from "./schemas/user.schema.js";
import { User } from "./schemas/user.schema.js";
import { toUserDto } from "./users.mapper.js";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private readonly refreshModel: Model<RefreshTokenDocument>,
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async getById(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException("کاربر یافت نشد");
    return toUserDto(user);
  }

  async findOrCreateByMobile(mobile: string): Promise<UserDto> {
    const user = await this.userModel
      .findOneAndUpdate(
        { mobile },
        { $setOnInsert: { mobile, role: "user" } },
        { upsert: true, returnDocument: "after" },
      )
      .lean();
    return toUserDto(user);
  }

  async setRoleByMobile(mobile: string, role: Role): Promise<UserDto> {
    const user = await this.userModel
      .findOneAndUpdate(
        { mobile },
        { $set: { role }, $setOnInsert: { mobile } },
        { upsert: true, returnDocument: "after" },
      )
      .lean();
    return toUserDto(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserDto> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: dto }, { returnDocument: "after" })
      .lean();
    if (!user) throw new NotFoundException("کاربر یافت نشد");
    return toUserDto(user);
  }

  /**
   * Also ends every session of the account, so a refresh token issued before the deletion is worthless,
   * and takes down the account's reviews, which carry the person's name.
   */
  async softDelete(id: string): Promise<void> {
    const now = new Date();
    await this.userModel.updateOne({ _id: id }, { $set: { deletedAt: now } });
    await this.refreshModel.updateMany(
      { userId: new Types.ObjectId(id), familyRevoked: false },
      { $set: { familyRevoked: true, revokedAt: now } },
    );
    await this.reviewModel.updateMany(
      { userId: new Types.ObjectId(id) },
      { $set: { deletedAt: now } },
    );
  }
}
