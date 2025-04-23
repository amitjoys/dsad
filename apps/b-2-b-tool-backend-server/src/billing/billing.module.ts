import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { BillingModuleBase } from "./base/billing.module.base";
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { BillingResolver } from "./billing.resolver";

@Module({
  imports: [BillingModuleBase, forwardRef(() => AuthModule)],
  controllers: [BillingController],
  providers: [BillingService, BillingResolver],
  exports: [BillingService],
})
export class BillingModule {}
