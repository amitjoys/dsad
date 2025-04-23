import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { SubcategoryModuleBase } from "./base/subcategory.module.base";
import { SubcategoryService } from "./subcategory.service";
import { SubcategoryController } from "./subcategory.controller";
import { SubcategoryResolver } from "./subcategory.resolver";

@Module({
  imports: [SubcategoryModuleBase, forwardRef(() => AuthModule)],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, SubcategoryResolver],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
