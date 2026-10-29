import { watchSlugSchema } from "@kronos/contracts";
import type { PipeTransform } from "@nestjs/common";
import { Injectable, NotFoundException } from "@nestjs/common";

/** Like a malformed id, a malformed slug can never name a watch, so it is a 404. */
@Injectable()
export class ParseWatchSlugPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const result = watchSlugSchema.safeParse(value);
    if (!result.success) throw new NotFoundException("ساعت یافت نشد");
    return result.data;
  }
}
