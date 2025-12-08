import { NextRequest, NextResponse } from 'next/server';
import { jobs } from '@/lib/rabbitmq';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    // Queue the email
    const queued = await jobs.sendEmail({
      to,
      subject,
      body: message,
    });

    if (!queued) {
      return NextResponse.json(
        { error: 'Failed to queue email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email queued for sending',
    });
  } catch (error: any) {
    console.error('Queue email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
