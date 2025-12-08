import { queue, QUEUES, JobPayload } from '@/lib/rabbitmq';
import * as nodemailer from 'nodemailer';

interface EmailJob {
  to: string;
  subject: string;
  body: string;
  template?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

async function handleEmailJob(payload: JobPayload<EmailJob>) {
  console.log(`Processing email job: ${payload.id}`);
  
  try {
    const { to, subject, body } = payload.data;
    const mailer = getTransporter();
    
    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body,
    });
    
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error; // Will be requeued
  }
}

export async function startEmailWorker() {
  console.log('Starting Email Worker...');
  await queue.consume<EmailJob>(QUEUES.EMAIL, handleEmailJob);
}

// Run worker if executed directly
if (require.main === module) {
  startEmailWorker().catch(console.error);
}
