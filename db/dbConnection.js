import mongoose from 'mongoose';

//const con = 'mongodb://127.0.0.1:27017/mongo'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;