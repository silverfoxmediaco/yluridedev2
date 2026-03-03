// backend/scripts/migrateVanSchema.js
// Migration: Set existing vans to owner:null, listingType:fleet, approvalStatus:approved
//
// Usage: node backend/scripts/migrateVanSchema.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ntxluxuryvans';

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db.collection('vans').updateMany(
      { listingType: { $exists: false } },
      {
        $set: {
          owner: null,
          listingType: 'fleet',
          approvalStatus: 'approved'
        }
      }
    );

    console.log(`Migration complete. ${result.modifiedCount} van(s) updated.`);
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrate();
