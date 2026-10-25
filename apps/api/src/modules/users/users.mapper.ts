import type { UserDto } from "@kronos/contracts";

import type { User } from "./schemas/user.schema.js";

export function toUserDto(user: User): UserDto {
  return {
    id: user._id.toString(),
    mobile: user.mobile,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email ?? null,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
