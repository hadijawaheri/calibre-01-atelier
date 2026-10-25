import type { ErrorCode } from "@kronos/contracts";
import { HttpException } from "@nestjs/common";

/** An HTTP error with an explicit machine-readable code for the client. */
export class AppException extends HttpException {
  constructor(
    status: number,
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message, status);
  }
}
