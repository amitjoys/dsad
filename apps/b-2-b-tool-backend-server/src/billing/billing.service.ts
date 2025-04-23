import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BillingServiceBase } from "./base/billing.service.base";

@Injectable()
export class BillingService extends BillingServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
