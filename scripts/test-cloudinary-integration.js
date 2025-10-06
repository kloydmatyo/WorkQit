const fs = require('fs');
const path = require('path');

async function testCloudinaryIntegration() {
  console.log('🧪 Testing Cloudinary Integration\n');

  // Check environment variables
  console.log('1️⃣ Checking Environment Variables...');
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  let envVarsOk = true;
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: Set`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      envVarsOk = false;
    }
  });

  if (!envVarsOk) {
    console.log('\n❌ Missing required environment variables');
    console.log('   Please add Cloudinary credentials to .env.local:');
    console.log('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('   CLOUDINARY_API_KEY=your_api_key');
    console.log('   CLOUDINARY_API_SECRET=your_api_secret');
    return;
  }

  // Check if Cloudinary package is installed
  console.log('\n2️⃣ Checking Package Installation...');
  try {
    require('cloudinary');
    console.log('   ✅ Cloudinary package installed');
  } catch (error) {
    console.log('   ❌ Cloudinary package not found');
    console.log('   Run: npm install cloudinary');
    return;
  }

  // Check if files exist
  console.log('\n3️⃣ Checking File Structure...');
  const requiredFiles = [
    'lib/cloudinary.ts',
    'components/ResumeUpload.tsx',
    'app/api/upload/resume/route.ts'
  ];

  let filesOk = true;
  requiredFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${filePath}: Exists`);
    } else {
      console.log(`   ❌ ${filePath}: Missing`);
      filesOk = false;
    }
  });

  if (!filesOk) {
    console.log('\n❌ Missing required files');
    return;
  }

  // Test Cloudinary configuration
  console.log('\n4️⃣ Testing Cloudinary Configuration...');
  try {
    const { v2: cloudinary } = require('cloudinary');
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary config:', cloudinary.config()); // Add this line

    // Test API connection
    const result = await cloudinary.api.ping();
    console.log('   ✅ Cloudinary API connection successful');
    console.log(`   📊 Status: ${result.status}`);
  } catch (error) {
    console.log('   ❌ Cloudinary API connection failed');
    console.log('   Error object:', error); // Add this line
    console.log(`   Error: ${error.message}`);
    return;
  }

  // Check upload folder permissions
  console.log('\n5️⃣ Testing Upload Permissions...');
  try {
    const { v2: cloudinary } = require('cloudinary');
    
    // Try to list resources in the upload folder
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'workqit/resumes',
      max_results: 1
    });
    
    console.log('   ✅ Upload folder accessible');
    console.log(`   📁 Found ${resources.resources.length} existing files`);
  } catch (error) {
    console.log('   ⚠️  Upload folder check failed (this is normal for new accounts)');
    console.log(`   Info: ${error.message}`);
  }

  // Summary
  console.log('\n🎉 Cloudinary Integration Test Complete!');
  console.log('\n📋 Setup Summary:');
  console.log('   ✅ Environment variables configured');
  console.log('   ✅ Required packages installed');
  console.log('   ✅ File structure in place');
  console.log('   ✅ Cloudinary API connection working');
  
  console.log('\n🚀 Next Steps:');
  console.log('   1. Start your development server: npm run dev');
  console.log('   2. Navigate to /profile as a job seeker');
  console.log('   3. Test resume upload functionality');
  console.log('   4. Apply to a job to test resume inclusion');
  
  console.log('\n📚 Documentation:');
  console.log('   - Setup Guide: CLOUDINARY_SETUP_GUIDE.md');
  console.log('   - API Endpoints: /api/upload/resume');
  console.log('   - Component: components/ResumeUpload.tsx');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testCloudinaryIntegration().catch(error => {
  console.error('❌ Test failed:', error);
});