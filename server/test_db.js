const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function test() {
    console.log('--- Testing MongoDB Connectivity ---');
    console.log('URI:', uri.replace(/:([^@]+)@/, ':****@')); // Hide password

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
    });

    try {
        await client.connect();
        console.log('✅ Connection Successful!');
        const dbs = await client.db().admin().listDatabases();
        console.log('Databases:', dbs.databases.map(d => d.name));
    } catch (err) {
        console.error('❌ Connection Failed!');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.message.includes('IP address')) {
            console.error('\n⚠️ YOUR IP IS NOT WHITELISTED in MongoDB Atlas.');
            console.error('Go to Atlas > Network Access > Add IP Address > Allow Access From Anywhere (0.0.0.0/0)');
        }
    } finally {
        await client.close();
    }
}

test();
