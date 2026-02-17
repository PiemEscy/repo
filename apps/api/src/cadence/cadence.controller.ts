import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CadenceService } from "./cadence.service";
import type { Cadence } from "../types/cadence.types";

@Controller("cadences")
export class CadenceController {
  constructor(private readonly service: CadenceService) {}

  @Post()
  create(@Body() cadence: Cadence) {
    return this.service.create(cadence);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body("steps") steps: Cadence["steps"]
  ) {
    return this.service.update(id, steps);
  }
}
