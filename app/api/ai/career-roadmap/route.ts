import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateCareerRoadmap } from '@/lib/ai-career-service';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { careerGoal, timeframe } = body;

    if (!careerGoal) {
      return NextResponse.json(
        { error: 'Career goal is required' },
        { status: 400 }
      );
    }

    // Get user skills
    const userProfile: any = await User.findById(user.userId).select('profile').lean();
    const currentSkills = userProfile?.profile?.skills || [];

    const roadmap = await generateCareerRoadmap(
      careerGoal,
      currentSkills,
      timeframe || '1-2 years'
    );

    return NextResponse.json({
      roadmap,
      message: 'Career roadmap generated successfully',
    });
  } catch (error) {
    console.error('Error generating career roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate career roadmap' },
      { status: 500 }
    );
  }
}
