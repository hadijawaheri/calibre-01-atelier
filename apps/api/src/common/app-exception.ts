import { HttpException } from "@nestjs/common";
import type { ErrorCode } from "@kronos/contracts";

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
