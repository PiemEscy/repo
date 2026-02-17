import { Injectable, NotFoundException } from "@nestjs/common";
import { Cadence } from "../types/cadence.types";

@Injectable()
export class CadenceService {
  // In-memory storage
  private cadences = new Map<string, Cadence>();

  // Create cadence
  create(cadence: Cadence): { id: string } {
    this.cadences.set(cadence.id, cadence);
    return { id: cadence.id };
  }

  // Get cadence
  findOne(id: string): Cadence {
    const cadence = this.cadences.get(id);
    if (!cadence) {
      throw new NotFoundException(`Cadence ${id} not found`);
    }
    return cadence;
  }

  // Update cadence
  update(id: string, steps: Cadence["steps"]): Cadence {
    const cadence = this.cadences.get(id);
    if (!cadence) {
      throw new NotFoundException(`Cadence ${id} not found`);
    }

    const updatedCadence = { ...cadence, steps };
    this.cadences.set(id, updatedCadence);
    return updatedCadence;
  }
}
