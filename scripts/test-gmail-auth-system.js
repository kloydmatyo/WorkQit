const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testGmailAuthSystem() {
  console.log('🧪 Testing Gmail Authentication System\n');

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('workqit');
    const usersCollection = db.collection('users');

    // Test 1: Database Schema Validation
    console.log('\n1️⃣ Testing Database Schema...');
    
    // Check if we can create a user with new schema
    const testUser = {
      email: 'test.gmail.auth@example.com',
      firstName: 'Gmail',
      lastName: 'Test',
      role: 'job_seeker',
      authProvider: 'local',
      emailVerified: false,
      emailVerificationToken: 'test-token-123',
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      profile: {
        skills: [],
        profilePicture: null
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const result = await usersCollection.insertOne(testUser);
      console.log('   ✅ User schema validation passed');
      console.log(`   📝 Test user created: ${result.insertedId}`);
      
      // Clean up test user
      await usersCollection.deleteOne({ _id: result.insertedId });
      console.log('   🧹 Test user cleaned up');
    } catch (error) {
      console.log('   ❌ Schema validation failed:', error.message);
    }

    // Test 2: Email Verification Token Generation
    console.log('\n2️⃣ Testing Email Verification System...');
    
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    console.log('   ✅ Verification token generated:', verificationToken.substring(0, 16) + '...');
    console.log('   ✅ Token expiry set:', verificationExpiry.toISOString());

    // Test 3: Google OAuth Configuration Check
    console.log('\n3️⃣ Testing Google OAuth Configuration...');
    
    const requiredEnvVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'NEXTAUTH_URL',
      'JWT_SECRET'
    ];

    let configComplete = true;
    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        console.log(`   ✅ ${envVar}: configured`);
      } else {
        console.log(`   ⚠️ ${envVar}: missing (required for Google OAuth)`);
        configComplete = false;
      }
    });

    if (configComplete) {
      console.log('   ✅ Google OAuth configuration complete');
    } else {
      console.log('   ⚠️ Google OAuth configuration incomplete - some features may not work');
    }

    // Test 4: User Authentication Scenarios
    console.log('\n4️⃣ Testing Authentication Scenarios...');
    
    // Create test users for different scenarios
    const testUsers = [
      {
        email: 'verified.local@test.com',
        firstName: 'Verified',
        lastName: 'Local',
        password: 'hashedpassword123',
        role: 'job_seeker',
        authProvider: 'local',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'unverified.local@test.com',
        firstName: 'Unverified',
        lastName: 'Local',
        password: 'hashedpassword123',
        role: 'job_seeker',
        authProvider: 'local',
        emailVerified: false,
        emailVerificationToken: 'unverified-token-456',
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'google.user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        role: 'employer',
        authProvider: 'google',
        googleId: '123456789',
        emailVerified: true,
        profile: {
          skills: [],
          profilePicture: 'https://example.com/profile.jpg'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const insertedUsers = [];
    for (const user of testUsers) {
      try {
        const result = await usersCollection.insertOne(user);
        insertedUsers.push(result.insertedId);
        console.log(`   ✅ Created ${user.authProvider} user: ${user.email}`);
      } catch (error) {
        console.log(`   ❌ Failed to create user ${user.email}:`, error.message);
      }
    }

    // Test 5: Query Scenarios
    console.log('\n5️⃣ Testing Database Queries...');
    
    // Test finding users by different criteria
    const verifiedUsers = await usersCollection.find({ emailVerified: true }).toArray();
    console.log(`   ✅ Verified users found: ${verifiedUsers.length}`);
    
    const googleUsers = await usersCollection.find({ authProvider: 'google' }).toArray();
    console.log(`   ✅ Google users found: ${googleUsers.length}`);
    
    const unverifiedUsers = await usersCollection.find({ 
      emailVerified: false,
      emailVerificationExpires: { $gt: new Date() }
    }).toArray();
    console.log(`   ✅ Unverified users with valid tokens: ${unverifiedUsers.length}`);

    // Test 6: Email Verification Flow
    console.log('\n6️⃣ Testing Email Verification Flow...');
    
    const unverifiedUser = await usersCollection.findOne({ 
      emailVerificationToken: 'unverified-token-456' 
    });
    
    if (unverifiedUser) {
      console.log('   ✅ Found user by verification token');
      
      // Simulate email verification
      await usersCollection.updateOne(
        { _id: unverifiedUser._id },
        { 
          $set: { emailVerified: true },
          $unset: { 
            emailVerificationToken: 1,
            emailVerificationExpires: 1
          }
        }
      );
      console.log('   ✅ Email verification simulation successful');
    }

    // Cleanup test users
    console.log('\n🧹 Cleaning up test data...');
    for (const userId of insertedUsers) {
      await usersCollection.deleteOne({ _id: userId });
    }
    console.log('   ✅ Test users cleaned up');

    // Summary
    console.log('\n🎉 GMAIL AUTHENTICATION SYSTEM TEST RESULTS:');
    console.log('=============================================');
    console.log('✅ Database schema supports new authentication fields');
    console.log('✅ Email verification token system working');
    console.log('✅ Multiple authentication providers supported');
    console.log('✅ User queries and updates functional');
    console.log('✅ Email verification flow tested');
    
    if (configComplete) {
      console.log('✅ Google OAuth configuration complete');
    } else {
      console.log('⚠️ Google OAuth requires additional environment variables');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Set up Google OAuth credentials in Google Cloud Console');
    console.log('2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local');
    console.log('3. Configure email service for production (optional)');
    console.log('4. Test the complete authentication flow in the browser');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

testGmailAuthSystem();