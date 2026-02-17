import { Module } from "@nestjs/common";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentService } from "./enrollment.service";
import { TemporalModule } from "../temporal/temporal.module";
import { CadenceModule } from "../cadence/cadence.module";

@Module({
  imports: [TemporalModule, CadenceModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
