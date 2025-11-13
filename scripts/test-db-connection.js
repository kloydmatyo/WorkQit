const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  console.log('🔄 Testing MongoDB connection...');
  console.log('📍 Connection URI:', uri.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // Test database operations
    const db = client.db('workqit');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📂 Available collections:', collections.map(c => c.name));

    // Test a simple operation
    const testCollection = db.collection('connection_test');
    const testDoc = { 
      message: 'Connection test successful', 
      timestamp: new Date(),
      platform: 'WorkQit'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted with ID:', insertResult.insertedId);

    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('🧹 Test document cleaned up');

    // Get database stats
    const stats = await db.stats();
    console.log('📊 Database stats:');
    console.log(`   - Database: ${stats.db}`);
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication issue - check username/password');
    } else if (error.message.includes('network')) {
      console.error('🌐 Network issue - check internet connection and IP whitelist');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout - check network and MongoDB Atlas status');
    }
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();