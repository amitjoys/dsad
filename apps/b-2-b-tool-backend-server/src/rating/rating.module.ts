import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RatingModuleBase } from "./base/rating.module.base";
import { RatingService } from "./rating.service";
import { RatingController } from "./rating.controller";
import { RatingResolver } from "./rating.resolver";

@Module({
  imports: [RatingModuleBase, forwardRef(() => AuthModule)],
  controllers: [RatingController],
  providers: [RatingService, RatingResolver],
  exports: [RatingService],
})
export class RatingModule {}
