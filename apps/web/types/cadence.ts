export type CadenceStep =
  | {
      id: string;
      type: "SEND_EMAIL";
      subject: string;
      body: string;
    }
  | {
      id: string;
      type: "WAIT";
      seconds: number;
    };

export interface Cadence {
  id: string;
  name: string;
  steps: CadenceStep[];
}

export interface EnrollmentState {
  id: string;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  currentStepIndex: number;
  stepsVersion: number;
}
