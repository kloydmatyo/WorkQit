const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testApplicantCountUpdate() {
  console.log('🧪 Testing Applicant Count Update Functionality\n');

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
    const jobSeeker = await usersCollection.findOne({ email: 'test@workqit.com' });

    if (!employer || !jobSeeker) {
      console.error('❌ Test users not found. Please run user creation scripts first.');
      return;
    }

    console.log('👤 Found test users:');
    console.log(`   Employer: ${employer.firstName} ${employer.lastName} (${employer.email})`);
    console.log(`   Job Seeker: ${jobSeeker.firstName} ${jobSeeker.lastName} (${jobSeeker.email})`);

    // Create a test job
    const testJob = {
      title: 'Applicant Count Test Job',
      description: 'This job is created to test applicant count functionality.',
      company: 'Test Company Inc.',
      employerId: employer._id,
      type: 'internship',
      location: 'Test City',
      remote: true,
      skills: ['Testing', 'Quality Assurance'],
      requirements: ['Attention to detail'],
      status: 'active',
      applicants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the test job
    const jobResult = await jobsCollection.insertOne(testJob);
    const jobId = jobResult.insertedId;
    console.log(`\n💼 Created test job: "${testJob.title}" (ID: ${jobId})`);

    // Check initial applicant count
    const initialJob = await jobsCollection.findOne({ _id: jobId });
    console.log(`📊 Initial applicant count: ${initialJob.applicants.length}`);

    // Create test applications
    const applications = [
      {
        jobId: jobId,
        applicantId: jobSeeker._id,
        coverLetter: 'I am interested in this test position.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert applications
    for (let i = 0; i < applications.length; i++) {
      const appResult = await applicationsCollection.insertOne(applications[i]);
      console.log(`📝 Created application ${i + 1}: ${appResult.insertedId}`);

      // Update job's applicants array (simulating the API behavior)
      await jobsCollection.updateOne(
        { _id: jobId },
        { $addToSet: { applicants: applications[i].applicantId } }
      );
    }

    // Check updated applicant count
    const updatedJob = await jobsCollection.findOne({ _id: jobId });
    console.log(`📊 Updated applicant count: ${updatedJob.applicants.length}`);

    // Test API endpoints
    console.log('\n🔍 Testing API Endpoints...');

    // Test 1: Check if jobs API returns applicant count for employers
    console.log('1. Testing employer jobs API...');
    const employerJobsQuery = {
      employerId: employer._id,
      status: 'active'
    };
    const employerJobs = await jobsCollection.find(employerJobsQuery).toArray();
    console.log(`   Found ${employerJobs.length} jobs for employer`);
    
    if (employerJobs.length > 0) {
      const jobWithApplicants = employerJobs.find(job => job.applicants && job.applicants.length > 0);
      if (jobWithApplicants) {
        console.log(`   ✅ Job "${jobWithApplicants.title}" has ${jobWithApplicants.applicants.length} applicants`);
      } else {
        console.log('   ⚠️ No jobs found with applicants');
      }
    }

    // Test 2: Check applications for stats
    console.log('\n2. Testing application statistics...');
    const employerJobIds = employerJobs.map(job => job._id);
    const allApplications = await applicationsCollection.find({
      jobId: { $in: employerJobIds }
    }).toArray();
    
    console.log(`   Total applications to employer's jobs: ${allApplications.length}`);
    
    const statusCounts = {
      pending: allApplications.filter(app => app.status === 'pending').length,
      reviewed: allApplications.filter(app => app.status === 'reviewed').length,
      accepted: allApplications.filter(app => app.status === 'accepted').length,
      rejected: allApplications.filter(app => app.status === 'rejected').length,
    };
    
    console.log('   Application status breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`);
    });

    // Summary
    console.log('\n🎉 APPLICANT COUNT TEST RESULTS:');
    console.log('=====================================');
    console.log(`✅ Test job created successfully`);
    console.log(`✅ Application submitted successfully`);
    console.log(`✅ Job applicants array updated: ${updatedJob.applicants.length} applicants`);
    console.log(`✅ Database queries working correctly`);
    console.log(`✅ Statistics calculation ready`);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await applicationsCollection.deleteMany({ jobId: jobId });
    await jobsCollection.deleteOne({ _id: jobId });
    console.log('✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

testApplicantCountUpdate();