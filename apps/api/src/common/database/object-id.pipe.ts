import type { PipeTransform } from "@nestjs/common";
import { Injectable, NotFoundException } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

/** A malformed id can never match a document, so it is a 404 rather than a 400. */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidObjectId(value) || !/^[a-f0-9]{24}$/.test(value)) {
      throw new NotFoundException("مورد درخواستی یافت نشد");
    }
    return value;
  }
}
