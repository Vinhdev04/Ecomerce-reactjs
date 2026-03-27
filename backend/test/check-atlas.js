import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function checkAtlas() {
  const url = process.env.DATABASE_URL;
  console.log('Connecting to Atlas...');
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('✅ Connected successfully to Atlas!');
    
    // List databases
    const dbs = await client.db().admin().listDatabases();
    console.log('Databases:', dbs.databases.map(db => db.name));

    // Get DB name from URL
    const dbName = 'xpadGame'; // Hardcoded for test
    console.log(`Checking collections in database: "${dbName}"`);
    const collections = await client.db(dbName).listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    if (collections.some(c => c.name === 'products')) {
      const count = await client.db(dbName).collection('products').countDocuments();
      console.log(`Product count in "products" collection: ${count}`);
      
      const firstProduct = await client.db(dbName).collection('products').findOne();
      console.log('Sample Product:', JSON.stringify(firstProduct, null, 2));
    }

  } catch (err) {
    console.error('❌ Error details:', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

checkAtlas();
