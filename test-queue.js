// Simple test script to queue a job
const amqp = require('amqplib');

async function testQueue() {
  try {
    const connection = await amqp.connect('amqp://workqit:workqit123@localhost:5672');
    const channel = await connection.createChannel();
    
    const queue = 'notifications_queue';
    await channel.assertQueue(queue, { durable: true });
    
    const message = {
      id: `test-${Date.now()}`,
      type: 'test_notification',
      data: {
        userId: '123',
        type: 'test',
        message: 'Hello from test script!',
      },
      createdAt: new Date().toISOString(),
    };
    
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    
    console.log('✅ Test job sent to queue:', message.id);
    
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testQueue();
