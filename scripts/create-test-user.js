const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  console.log('🔄 Creating test user...');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('workqit');
    const usersCollection = db.collection('users');

    // Test user data
    const testUser = {
      email: 'test@workqit.com',
      password: await bcrypt.hash('password123', 12),
      firstName: 'Test',
      lastName: 'User',
      role: 'job_seeker',
      profile: {
        bio: 'Test user for WorkQit platform',
        skills: ['JavaScript', 'React', 'Node.js'],
        location: 'Remote',
        experience: 'Entry Level',
        availability: 'full_time',
        remote: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log('👤 Test user already exists');
      console.log('📧 Email:', testUser.email);
      console.log('🔑 Password: password123');
      return;
    }

    // Create the user
    const result = await usersCollection.insertOne(testUser);
    console.log('✅ Test user created successfully!');
    console.log('🆔 User ID:', result.insertedId);
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password: password123');
    console.log('👤 Role:', testUser.role);

    // Create a test job for the user to apply to
    const jobsCollection = db.collection('jobs');
    const testJob = {
      title: 'Frontend Developer Intern',
      description: 'Join our team as a frontend developer intern. You will work on exciting projects using React and modern web technologies.',
      company: 'TechCorp Inc.',
      employerId: result.insertedId,
      type: 'internship',
      location: 'San Francisco, CA',
      remote: true,
      salary: {
        min: 15,
        max: 25,
        currency: 'USD'
      },
      requirements: [
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Familiarity with React',
        'Good communication skills'
      ],
      skills: ['JavaScript', 'React', 'HTML', 'CSS'],
      duration: '3 months',
      status: 'active',
      applicants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const jobResult = await jobsCollection.insertOne(testJob);
    console.log('💼 Test job created with ID:', jobResult.insertedId);

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

createTestUser();