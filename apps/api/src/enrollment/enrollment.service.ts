import { Injectable } from "@nestjs/common";
import { CadenceService } from "../cadence/cadence.service";

@Injectable()
export class EnrollmentService {
    private workflows: Record<string, any> = {};

    constructor(private readonly cadenceService: CadenceService) {}

    async startEnrollment(cadenceId: string, contactEmail: string, steps: any[]) {
        // Fetch cadence steps from CadenceService
        const cadence = this.cadenceService.findOne(cadenceId);
        if (!cadence) throw new Error(`Cadence ${cadenceId} not found`);

        const workflowId = `mock-${Date.now()}`;
        this.workflows[workflowId] = {
        id: workflowId,
        cadenceId,
        contactEmail,
        currentStepIndex: 0,
        stepsVersion: 1,
        status: 'RUNNING',
        steps: cadence.steps,
        };
        this.simulateWorkflow(workflowId);
        return { id: workflowId };
    }

    async getEnrollment(id: string) {
        return this.workflows[id];
    }

    async updateEnrollment(id: string, steps: any) {
        const wf = this.workflows[id];
        if (wf) {
        wf.stepsVersion++;
        wf.steps = steps;
        if (wf.currentStepIndex >= steps.length) wf.status = 'COMPLETED';
        }
        return { id, stepsVersion: wf?.stepsVersion || 1 };
    }

    private async simulateWorkflow(id: string) {
        const wf = this.workflows[id];

        // initialize array to store sent emails
        if (!wf.sentEmails) wf.sentEmails = [];

        for (let i = wf.currentStepIndex; i < wf.steps.length; i++) {
            const step = wf.steps[i];

            if (step.type === 'SEND_EMAIL') {
            const result = await this.sendEmailActivity(wf.contactEmail, step.subject, step.body);
            wf.sentEmails.push(result);
            } else if (step.type === 'WAIT') {
            await new Promise((res) => setTimeout(res, (step.seconds || 0) * 1000));
            }

            wf.currentStepIndex++;
        }

        wf.status = 'COMPLETED';
    }

    private async sendEmailActivity(to: string, subject: string, body: string) {
        const result = {
            success: true,
            messageId: 'mock-msg-' + Math.floor(Math.random() * 10000),
            timestamp: Date.now(),
        };
        console.log(`[SEND_EMAIL] To: ${to}, Subject: ${subject}, Body: ${body}`);
        console.log('Mock email returned:', result);
        return result;
    }

}
