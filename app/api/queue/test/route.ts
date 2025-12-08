import { NextResponse } from 'next/server';
import { queue, QUEUES } from '@/lib/rabbitmq';

export async function GET() {
  try {
    // Get queue stats
    const stats = await Promise.all(
      Object.values(QUEUES).map(async (queueName) => {
        const info = await queue.getQueueInfo(queueName);
        return {
          queue: queueName,
          messages: info.messageCount,
          consumers: info.consumerCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'RabbitMQ connection successful',
      queues: stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Send a test job
    const testJob = {
      id: `test-${Date.now()}`,
      type: 'test_job',
      data: { message: 'Hello from RabbitMQ!' },
      createdAt: new Date().toISOString(),
    };

    const sent = await queue.publish(QUEUES.NOTIFICATIONS, testJob);

    return NextResponse.json({
      success: sent,
      message: sent ? 'Test job queued successfully' : 'Failed to queue job',
      job: testJob,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
