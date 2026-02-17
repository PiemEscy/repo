import { Worker } from '@temporalio/worker';
import * as workflows from './workflows/cadence.workflow';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/cadence.workflow'),
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'email-cadence-queue',
  });

  console.log('Worker started...');
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
