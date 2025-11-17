// Small script to update user documents that have the default pravatar URL
// Usage: node backend/scripts/updateProfilePics.js

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/navpeerlearning';

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

  // Match any pravatar URL (with or without query string)
  const filter = { profilePicture: { $regex: '^https?://i\\.pravatar\\.cc/150' } };
  const update = { $set: { profilePicture: null } };

  const res = await User.updateMany(filter, update);
  console.log(`Matched ${res.matchedCount || res.n || 0}, modified ${res.modifiedCount || res.nModified || 0} documents`);
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  }
})();
