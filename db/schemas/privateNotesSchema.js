import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: {
    type: String,
    min: 0
  },
  password: {
    type: String,
    min: 0
  }
}, {timestamps: true});

export default mongoose.model('Password', schema, 'passwords');