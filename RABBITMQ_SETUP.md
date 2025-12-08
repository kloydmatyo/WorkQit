# RabbitMQ Setup Guide

## Overview
RabbitMQ is configured as a message queue for background job processing with the following features:
- Async email sending
- Student data synchronization
- Assessment scoring
- Notification delivery
- Report generation

## Quick Start

### Start RabbitMQ with Docker
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

RabbitMQ will be available at:
- **AMQP Port**: 5672 (for applications)
- **Management UI**: http://localhost:15672
- **Credentials**: workqit / workqit123

## Test RabbitMQ Connection

Visit: http://localhost/api/queue/test

Or use curl:
```bash
# Get queue stats
curl http://localhost/api/queue/test

# Send test job
curl -X POST http://localhost/api/queue/test
```

## Management UI

Access the RabbitMQ Management UI at: http://localhost:15672

**Login**:
- Username: `workqit`
- Password: `workqit123`

**Features**:
- View queues and messages
- Monitor consumers
- Check connection status
- Purge queues
- View message rates

## Queues

### Available Queues
1. **email_queue** - Email sending jobs
2. **student_sync_queue** - Student synchronization
3. **assessment_scoring_queue** - Assessment scoring
4. **notifications_queue** - User notifications
5. **reports_queue** - Report generation

## Usage Examples

### 1. Queue an Email
```typescript
import { jobs } from '@/lib/rabbitmq';

await jobs.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  body: '<h1>Welcome to WorkQit</h1>',
});
```

### 2. Queue Student Sync
```typescript
import { jobs } from '@/lib/rabbitmq';

await jobs.syncStudents({
  source: 'student-management-api',
  batchSize: 50,
});
```

### 3. Queue Assessment Scoring
```typescript
import { jobs } from '@/lib/rabbitmq';

await jobs.scoreAssessment({
  assessmentId: '123',
  userId: '456',
  answers: [/* answers */],
});
```

### 4. Send Notification
```typescript
import { jobs } from '@/lib/rabbitmq';

await jobs.sendNotification({
  userId: '123',
  type: 'mentor_request',
  message: 'You have a new mentorship request',
});
```

### 5. Generate Report
```typescript
import { jobs } from '@/lib/rabbitmq';

await jobs.generateReport({
  reportType: 'monthly_analytics',
  userId: '123',
  parameters: { month: 12, year: 2025 },
});
```

## Running Workers

Workers process jobs from the queues. You need to run them separately from your Next.js app.

### Start All Workers
```bash
npm run workers
```

### Start Individual Workers
```bash
# Email worker only
npm run worker:email

# Student sync worker only
npm run worker:sync

# Assessment worker only
npm run worker:assessment
```

### In Production
Use a process manager like PM2:
```bash
pm2 start npm --name "workers" -- run workers
pm2 save
pm2 startup
```

## API Endpoints

### Queue Email
```bash
POST /api/queue/email
Authorization: Bearer <token>

{
  "to": "user@example.com",
  "subject": "Test Email",
  "message": "<p>Hello!</p>"
}
```

### Async Student Sync
```bash
POST /api/admin/sync-students?async=true
```

### Test Queue
```bash
# Get stats
GET /api/queue/test

# Send test job
POST /api/queue/test
```

## Worker Implementation

### Create a Custom Worker

```typescript
// workers/myWorker.ts
import { queue, QUEUES, JobPayload } from '@/lib/rabbitmq';

interface MyJob {
  data: string;
}

async function handleMyJob(payload: JobPayload<MyJob>) {
  console.log(`Processing job: ${payload.id}`);
  
  try {
    // Your job logic here
    console.log(payload.data);
  } catch (error) {
    console.error('Job failed:', error);
    throw error; // Will be requeued
  }
}

export async function startMyWorker() {
  console.log('Starting My Worker...');
  await queue.consume<MyJob>(QUEUES.NOTIFICATIONS, handleMyJob);
}
```

### Queue a Custom Job

```typescript
import { queue, QUEUES } from '@/lib/rabbitmq';

await queue.publish(QUEUES.NOTIFICATIONS, {
  id: `custom-${Date.now()}`,
  type: 'my_custom_job',
  data: { data: 'Hello!' },
  createdAt: new Date().toISOString(),
});
```

## Configuration

### Environment Variables
```env
RABBITMQ_URL=amqp://workqit:workqit123@rabbitmq:5672
```

### Queue Options
- **Durable**: Queues survive broker restarts
- **Persistent**: Messages survive broker restarts
- **Auto-ack**: Disabled (manual acknowledgment)
- **Requeue on failure**: Enabled

## Monitoring

### Check Queue Stats
```typescript
import { queue, QUEUES } from '@/lib/rabbitmq';

const info = await queue.getQueueInfo(QUEUES.EMAIL);
console.log(`Messages: ${info.messageCount}`);
console.log(`Consumers: ${info.consumerCount}`);
```

### Purge Queue
```typescript
import { queue, QUEUES } from '@/lib/rabbitmq';

await queue.purgeQueue(QUEUES.EMAIL);
```

### View Logs
```bash
# RabbitMQ logs
docker-compose logs -f rabbitmq

# Worker logs
npm run workers
```

## Best Practices

1. **Always handle errors**: Failed jobs will be requeued
2. **Use idempotent operations**: Jobs may be processed multiple times
3. **Set timeouts**: Prevent jobs from running forever
4. **Monitor queue depth**: Alert if queues grow too large
5. **Use dead letter queues**: For permanently failed jobs
6. **Log everything**: Track job processing for debugging

## Troubleshooting

### RabbitMQ not connecting
```bash
# Check if RabbitMQ is running
docker-compose ps rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq

# View logs
docker-compose logs rabbitmq
```

### Workers not processing jobs
```bash
# Check if workers are running
ps aux | grep workers

# Restart workers
npm run workers
```

### Clear stuck messages
```bash
# Via Management UI
# Go to http://localhost:15672 > Queues > Select queue > Purge

# Via API
curl -X DELETE http://workqit:workqit123@localhost:15672/api/queues/%2F/email_queue/contents
```

### Check message rates
Visit: http://localhost:15672 > Queues > Click on queue name

## Performance Tips

1. **Multiple workers**: Run multiple worker instances for high load
2. **Prefetch count**: Limit messages per worker
3. **Batch processing**: Process multiple messages at once
4. **Priority queues**: Use for urgent jobs
5. **Message TTL**: Set expiry for time-sensitive jobs

## Integration Examples

### With Student Sync
```typescript
// Sync immediately
POST /api/admin/sync-students

// Queue for background processing
POST /api/admin/sync-students?async=true
```

### With Email Notifications
```typescript
// In your API route
import { jobs } from '@/lib/rabbitmq';

// Queue welcome email
await jobs.sendEmail({
  to: user.email,
  subject: 'Welcome to WorkQit!',
  body: welcomeEmailTemplate(user),
});
```

### With Assessment Scoring
```typescript
// After user submits assessment
import { jobs } from '@/lib/rabbitmq';

await jobs.scoreAssessment({
  assessmentId: assessment.id,
  userId: user.id,
  answers: submittedAnswers,
});

// Return immediately to user
return { message: 'Assessment submitted, scoring in progress' };
```

## Next Steps
- Add dead letter queues for failed jobs
- Implement job retry logic with exponential backoff
- Add job status tracking in database
- Set up monitoring and alerting
- Implement job scheduling (cron-like)
