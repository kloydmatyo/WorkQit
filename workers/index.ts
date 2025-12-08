import { startEmailWorker } from './emailWorker';
import { startStudentSyncWorker } from './studentSyncWorker';
import { startAssessmentWorker } from './assessmentWorker';
import { startNotificationWorker } from './notificationWorker';

export async function startAllWorkers() {
  console.log('Starting all workers...');
  
  try {
    await Promise.all([
      startEmailWorker(),
      startStudentSyncWorker(),
      startAssessmentWorker(),
      startNotificationWorker(),
    ]);
    
    console.log('All workers started successfully');
  } catch (error) {
    console.error('Failed to start workers:', error);
    process.exit(1);
  }
}

// Run all workers if executed directly
if (require.main === module) {
  startAllWorkers().catch(console.error);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down workers...');
    process.exit(0);
  });
}
