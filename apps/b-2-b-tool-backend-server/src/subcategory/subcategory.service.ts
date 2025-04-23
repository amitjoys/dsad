import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SubcategoryServiceBase } from "./base/subcategory.service.base";

@Injectable()
export class SubcategoryService extends SubcategoryServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
