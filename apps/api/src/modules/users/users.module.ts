import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RefreshToken, RefreshTokenSchema } from "../auth/schemas/refresh-token.schema.js";
import { User, UserSchema } from "./schemas/user.schema.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
