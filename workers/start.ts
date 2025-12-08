import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Now start the workers
import('./index').then(({ startAllWorkers }) => {
  startAllWorkers().catch((error) => {
    console.error('Failed to start workers:', error);
    process.exit(1);
  });
});
