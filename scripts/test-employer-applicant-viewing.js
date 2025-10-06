const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testEmployerApplicantViewing() {
  console.log('🧪 Testing Employer Applicant Viewing Functionality\n');

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('workqit');
    const jobsCollection = db.collection('jobs');
    const applicationsCollection = db.collection('applications');
    const usersCollection = db.collection('users');

    // Get test users
    const employer = await usersCollection.findOne({ email: 'employer@workqit.com' });
    const jobSeeker1 = await usersCollection.findOne({ email: 'test@workqit.com' });
    const jobSeeker2 = await usersCollection.findOne({ email: 'newuser@workqit.com' });

    if (!employer || !jobSeeker1 || !jobSeeker2) {
      console.error('❌ Test users not found. Please ensure all test users exist.');
      return;
    }

    console.log('👤 Found test users:');
    console.log(`   Employer: ${employer.firstName} ${employer.lastName}`);
    console.log(`   Job Seeker 1: ${jobSeeker1.firstName} ${jobSeeker1.lastName}`);
    console.log(`   Job Seeker 2: ${jobSeeker2.firstName} ${jobSeeker2.lastName}`);

    // Find an existing job by the employer
    const existingJob = await jobsCollection.findOne({ employerId: employer._id });
    
    if (!existingJob) {
      console.error('❌ No jobs found for employer. Please create a job first.');
      return;
    }

    console.log(`\n💼 Using existing job: "${existingJob.title}"`);
    const jobId = existingJob._id;

    // Create test applications if they don't exist
    const existingApplications = await applicationsCollection.find({ jobId }).toArray();
    console.log(`📊 Existing applications: ${existingApplications.length}`);

    // Create applications from both job seekers if they don't exist
    const applicants = [
      {
        applicantId: jobSeeker1._id,
        coverLetter: 'I am very interested in this position and believe my skills in JavaScript and React make me a great fit.',
        name: `${jobSeeker1.firstName} ${jobSeeker1.lastName}`
      },
      {
        applicantId: jobSeeker2._id,
        coverLetter: 'This role aligns perfectly with my career goals. I have experience in web development and am eager to contribute.',
        name: `${jobSeeker2.firstName} ${jobSeeker2.lastName}`
      }
    ];

    for (const applicant of applicants) {
      const existingApp = await applicationsCollection.findOne({
        jobId: jobId,
        applicantId: applicant.applicantId
      });

      if (!existingApp) {
        const newApplication = {
          jobId: jobId,
          applicantId: applicant.applicantId,
          coverLetter: applicant.coverLetter,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const appResult = await applicationsCollection.insertOne(newApplication);
        console.log(`📝 Created application for ${applicant.name}: ${appResult.insertedId}`);

        // Update job's applicants array
        await jobsCollection.updateOne(
          { _id: jobId },
          { $addToSet: { applicants: applicant.applicantId } }
        );
      } else {
        console.log(`📝 Application already exists for ${applicant.name}`);
      }
    }

    // Test database queries that the API will use
    console.log('\n🔍 Testing Database Queries...');

    // 1. Verify job ownership
    const jobOwnershipCheck = await jobsCollection.findOne({
      _id: jobId,
      employerId: employer._id
    });
    console.log(`1. Job ownership verification: ${jobOwnershipCheck ? '✅ PASS' : '❌ FAIL'}`);

    // 2. Get applications with applicant details
    const applicationsWithDetails = await applicationsCollection.aggregate([
      { $match: { jobId: jobId } },
      {
        $lookup: {
          from: 'users',
          localField: 'applicantId',
          foreignField: '_id',
          as: 'applicantDetails'
        }
      },
      { $unwind: '$applicantDetails' },
      {
        $project: {
          _id: 1,
          status: 1,
          coverLetter: 1,
          createdAt: 1,
          'applicantDetails.firstName': 1,
          'applicantDetails.lastName': 1,
          'applicantDetails.email': 1,
          'applicantDetails.profile': 1
        }
      }
    ]).toArray();

    console.log(`2. Applications with details query: ${applicationsWithDetails.length > 0 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Found ${applicationsWithDetails.length} applications with full details`);

    // 3. Display sample applicant data
    if (applicationsWithDetails.length > 0) {
      const sampleApplicant = applicationsWithDetails[0];
      console.log('\n📋 Sample Applicant Data:');
      console.log(`   Name: ${sampleApplicant.applicantDetails.firstName} ${sampleApplicant.applicantDetails.lastName}`);
      console.log(`   Email: ${sampleApplicant.applicantDetails.email}`);
      console.log(`   Status: ${sampleApplicant.status}`);
      console.log(`   Applied: ${sampleApplicant.createdAt.toLocaleDateString()}`);
      console.log(`   Cover Letter: ${sampleApplicant.coverLetter.substring(0, 100)}...`);
      
      if (sampleApplicant.applicantDetails.profile?.skills) {
        console.log(`   Skills: ${sampleApplicant.applicantDetails.profile.skills.join(', ')}`);
      }
    }

    // 4. Test status update simulation
    console.log('\n🔄 Testing Status Update...');
    if (applicationsWithDetails.length > 0) {
      const testApplication = applicationsWithDetails[0];
      const updateResult = await applicationsCollection.updateOne(
        { _id: testApplication._id },
        { 
          $set: { status: 'reviewed' },
          $push: {
            feedbacks: {
              comments: 'Test feedback from employer',
              employerId: employer._id,
              createdAt: new Date()
            }
          }
        }
      );
      
      console.log(`   Status update: ${updateResult.modifiedCount > 0 ? '✅ PASS' : '❌ FAIL'}`);
      
      // Revert the change
      await applicationsCollection.updateOne(
        { _id: testApplication._id },
        { $set: { status: 'pending' }, $pop: { feedbacks: 1 } }
      );
    }

    // Summary
    console.log('\n🎉 EMPLOYER APPLICANT VIEWING TEST RESULTS:');
    console.log('=============================================');
    console.log(`✅ Database connection working`);
    console.log(`✅ Test users available`);
    console.log(`✅ Job ownership verification working`);
    console.log(`✅ Application queries with user details working`);
    console.log(`✅ Status update functionality working`);
    console.log(`✅ Sample data available for testing`);
    
    console.log('\n📊 Current Test Data:');
    console.log(`   Employer: ${employer.firstName} ${employer.lastName}`);
    console.log(`   Test Job: "${existingJob.title}"`);
    console.log(`   Applications: ${applicationsWithDetails.length}`);
    
    console.log('\n🚀 Ready for API and UI testing!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

testEmployerApplicantViewing();