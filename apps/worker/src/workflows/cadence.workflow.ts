import { proxyActivities, defineSignal, defineQuery, setHandler } from '@temporalio/workflow';
import type * as activities from '../activities/email.activity';

export interface CadenceStep {
  id: string;
  type: 'SEND_EMAIL' | 'WAIT';
  subject?: string;
  body?: string;
  seconds?: number;
}

export interface CadenceWorkflowInput {
  cadenceId: string;
  contactEmail: string;
  steps: CadenceStep[];
}

export interface CadenceState {
  currentStepIndex: number;
  stepsVersion: number;
  status: 'RUNNING' | 'COMPLETED';
  steps: CadenceStep[];
}

const { sendEmailActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const updateCadenceSignal = defineSignal<[CadenceStep[]]>('updateCadence');
export const getStateQuery = defineQuery<CadenceState>('getState');

export async function cadenceWorkflow(cadence: any, contactEmail: string) {
  for (const step of cadence.steps) {
    if (step.type === 'SEND_EMAIL') {
      // Call the mock email activity
      const result = await sendEmailActivity(cadence.id, contactEmail, step.subject, step.body);
      console.log('Mock email result:', result);
    } else if (step.type === 'WAIT') {
      await new Promise((res) => setTimeout(res, (step.seconds || 0) * 1000));
    }
  }
}
