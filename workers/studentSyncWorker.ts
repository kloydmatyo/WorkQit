import { queue, QUEUES, JobPayload } from '@/lib/rabbitmq';
import { syncStudentsFromAPI } from '@/services/studentManagementService';

interface StudentSyncJob {
  source: string;
  batchSize?: number;
}

async function handleStudentSyncJob(payload: JobPayload<StudentSyncJob>) {
  console.log(`Processing student sync job: ${payload.id}`);
  
  try {
    const { source, batchSize = 50 } = payload.data;
    
    console.log(`Syncing students from ${source} with batch size ${batchSize}`);
    
    const result = await syncStudentsFromAPI();
    
    console.log(`Student sync completed: ${result.synced} synced, ${result.failed} failed`);
  } catch (error) {
    console.error('Student sync failed:', error);
    throw error; // Will be requeued
  }
}

export async function startStudentSyncWorker() {
  console.log('Starting Student Sync Worker...');
  await queue.consume<StudentSyncJob>(QUEUES.STUDENT_SYNC, handleStudentSyncJob);
}

// Run worker if executed directly
if (require.main === module) {
  startStudentSyncWorker().catch(console.error);
}
