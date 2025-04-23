import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { RatingService } from "./rating.service";
import { RatingControllerBase } from "./base/rating.controller.base";

@swagger.ApiTags("ratings")
@common.Controller("ratings")
export class RatingController extends RatingControllerBase {
  constructor(
    protected readonly service: RatingService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
