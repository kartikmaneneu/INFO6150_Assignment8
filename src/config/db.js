const mongoose = require('mongoose');

async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/info6150_assignment8';

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoURI);
  console.log('MongoDB connected successfully.');
}

module.exports = { connectDB };
