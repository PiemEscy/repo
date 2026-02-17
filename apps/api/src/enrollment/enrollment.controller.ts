import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";

@Controller("enrollments")  // <-- this is critical
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  @Post()
  startEnrollment(@Body() body: { cadenceId: string; contactEmail: string;  steps: any[] }) {
    return this.service.startEnrollment(body.cadenceId, body.contactEmail, body.steps);
  }

  @Get(":id")
  getEnrollment(@Param("id") id: string) {
    return this.service.getEnrollment(id);
  }

  @Post(":id/update-cadence")
  updateEnrollment(
    @Param("id") id: string,
    @Body("steps") steps: any
  ) {
    return this.service.updateEnrollment(id, steps);
  }
}
