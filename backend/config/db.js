const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATBASE_URL);
    console.log('Database connected');
    console.log('===================================================================');
  } catch (error) {
    console.error('DB connection error : ', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
