import type { Role } from "@kronos/contracts";
import type { Request } from "express";

export interface JwtPayload {
  sub: string;
  role: Role;
}

export interface AuthUser {
  id: string;
  role: Role;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}
