import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class TemporalService implements OnModuleInit {
  private client: any;

  async onModuleInit() {
    this.client = {
      workflow: () => ({
        start: async () => ({ id: "mock-workflow-id" }),
        query: async () => ({ status: "RUNNING" }),
        signal: async () => true,
      }),
    };
    console.log("Temporal client mocked for local development");
  }

  getClient(): any {
    return this.client;
  }
}
