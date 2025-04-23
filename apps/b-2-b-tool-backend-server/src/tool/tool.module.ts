import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ToolModuleBase } from "./base/tool.module.base";
import { ToolService } from "./tool.service";
import { ToolController } from "./tool.controller";
import { ToolResolver } from "./tool.resolver";

@Module({
  imports: [ToolModuleBase, forwardRef(() => AuthModule)],
  controllers: [ToolController],
  providers: [ToolService, ToolResolver],
  exports: [ToolService],
})
export class ToolModule {}
