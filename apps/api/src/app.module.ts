import { Module } from "@nestjs/common";
import { CadenceModule } from "./cadence/cadence.module";
import { EnrollmentModule } from "./enrollment/enrollment.module";
import { TemporalModule } from "./temporal/temporal.module";

@Module({
  imports: [CadenceModule, EnrollmentModule, TemporalModule],
})
export class AppModule {}
