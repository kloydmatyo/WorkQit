import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCareerSuggestions } from '@/lib/ai-career-service';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Verifying user token...');
    const user = await verifyToken(request);

    if (!user) {
      console.log('❌ Unauthorized - no user token');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ User verified:', user.userId);
    await dbConnect();

    const body = await request.json();
    const { skills, interests, experience } = body;
    console.log('📥 Request body:', { skills, interests, experience });

    // Get user profile for additional context
    const userProfile: any = await User.findById(user.userId).select('profile').lean();
    console.log('👤 User profile skills:', userProfile?.profile?.skills);
    
    const userSkills = skills || userProfile?.profile?.skills || [];

    if (userSkills.length === 0) {
      console.log('⚠️ No skills found');
      return NextResponse.json(
        { error: 'Please add skills to your profile first to get personalized career suggestions' },
        { status: 400 }
      );
    }

    console.log('🤖 Calling AI with skills:', userSkills);
    const suggestions = await getCareerSuggestions(
      userSkills,
      interests,
      experience || userProfile?.profile?.experience
    );

    console.log('✅ AI suggestions generated:', suggestions.length);
    return NextResponse.json({
      suggestions,
      message: 'Career suggestions generated successfully',
    });
  } catch (error) {
    console.error('❌ Error generating career suggestions:', error);
    return NextResponse.json(
      { error: `Failed to generate career suggestions: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
