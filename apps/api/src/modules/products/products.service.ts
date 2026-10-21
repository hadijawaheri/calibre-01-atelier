import type {
  PaginatedResponse,
  PaginationQuery,
  ProductDto,
  ProductListQuery,
  ProductSummaryDto,
} from "@kronos/contracts";
import { pageMeta } from "@kronos/contracts";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { QueryFilter, SortOrder } from "mongoose";
import { Model, mongo } from "mongoose";

import type { ProductInputDto, UpdateProductDto } from "./dto/product.dto.js";
import { toProductDto, toProductSummaryDto } from "./products.mapper.js";
import type { ProductDocument } from "./schemas/product.schema.js";
import { Product } from "./schemas/product.schema.js";

const SORTS: Record<ProductListQuery["sort"], Record<string, SortOrder>> = {
  featured: { isFeatured: -1, createdAt: -1, _id: -1 },
  newest: { createdAt: -1, _id: -1 },
  "price-asc": { price: 1, _id: 1 },
  "price-desc": { price: -1, _id: -1 },
};

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function searchFilter(search: string | undefined): QueryFilter<Product> {
  if (!search) return {};
  const pattern = new RegExp(escapeRegex(search), "i");
  return { $or: [{ name: pattern }, { nameEn: pattern }, { reference: pattern }] };
}

function isDuplicateKey(error: unknown): boolean {
  return error instanceof mongo.MongoServerError && error.code === 11000;
}

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async listPublished(query: ProductListQuery): Promise<PaginatedResponse<ProductSummaryDto>> {
    const filter: QueryFilter<Product> = { isPublished: true, ...searchFilter(query.search) };
    if (query.collection) filter.series = { $in: query.collection };
    if (query.material) filter["case.material"] = { $in: query.material };
    if (query.movement) filter["movement.type"] = { $in: query.movement };
    if (query.inStock) filter.stock = { $gt: 0 };
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {
        ...(query.minPrice !== undefined && { $gte: query.minPrice }),
        ...(query.maxPrice !== undefined && { $lte: query.maxPrice }),
      };
    }

    const [items, totalItems] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(SORTS[query.sort])
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .lean(),
      this.productModel.countDocuments(filter),
    ]);
    return {
      data: items.map(toProductSummaryDto),
      meta: pageMeta(query.page, query.limit, totalItems),
    };
  }

  async getPublishedBySlug(slug: string): Promise<ProductDto> {
    const product = await this.productModel.findOne({ slug, isPublished: true }).lean();
    if (!product) throw new NotFoundException("ساعت مورد نظر یافت نشد");
    return toProductDto(product);
  }

  async listRelated(slug: string, limit = 3): Promise<ProductSummaryDto[]> {
    const product = await this.productModel.findOne({ slug, isPublished: true }).lean();
    if (!product) throw new NotFoundException("ساعت مورد نظر یافت نشد");
    const sameCollection = await this.productModel
      .find({ isPublished: true, slug: { $ne: slug }, series: product.series })
      .sort(SORTS.featured)
      .limit(limit)
      .lean();
    const others =
      sameCollection.length < limit
        ? await this.productModel
            .find({
              isPublished: true,
              slug: { $nin: [slug, ...sameCollection.map((item) => item.slug)] },
            })
            .sort(SORTS.featured)
            .limit(limit - sameCollection.length)
            .lean()
        : [];
    return [...sameCollection, ...others].map(toProductSummaryDto);
  }

  async listAll(query: PaginationQuery): Promise<PaginatedResponse<ProductDto>> {
    const filter = searchFilter(query.search);
    const [items, totalItems] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .lean(),
      this.productModel.countDocuments(filter),
    ]);
    return { data: items.map(toProductDto), meta: pageMeta(query.page, query.limit, totalItems) };
  }

  async getById(id: string): Promise<ProductDto> {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException("ساعت مورد نظر یافت نشد");
    return toProductDto(product);
  }

  async create(dto: ProductInputDto): Promise<ProductDto> {
    try {
      const created = await this.productModel.create(dto);
      return toProductDto(created.toObject());
    } catch (error) {
      if (isDuplicateKey(error)) throw new ConflictException("این اسلاگ قبلاً استفاده شده است");
      throw error;
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDto> {
    try {
      const product = await this.productModel
        .findByIdAndUpdate(id, { $set: dto }, { returnDocument: "after", runValidators: true })
        .lean();
      if (!product) throw new NotFoundException("ساعت مورد نظر یافت نشد");
      return toProductDto(product);
    } catch (error) {
      if (isDuplicateKey(error)) throw new ConflictException("این اسلاگ قبلاً استفاده شده است");
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.productModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), isPublished: false } },
    );
    if (result.matchedCount === 0) throw new NotFoundException("ساعت مورد نظر یافت نشد");
  }
}
