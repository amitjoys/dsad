import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { BillingService } from "./billing.service";
import { BillingControllerBase } from "./base/billing.controller.base";

@swagger.ApiTags("billings")
@common.Controller("billings")
export class BillingController extends BillingControllerBase {
  constructor(
    protected readonly service: BillingService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
