import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    min: 3,
    select: false
  },
  username: {
    type: String,
    unique: true,
    required: true,
    min: 0
  },
  photoUrl: {
    type: String
  },
  coverUrl: {
    type: String
  },
  isPrivate:{
    type: Boolean,
    default: false
  },
  age:{
    type: Number,
    required: true,
    min: 13
  },
  role:{
    type: String,
    min: 0,
    default: 'Geust'
  },
  bio:{
    type: String,
    min: 0,
    max: 110
  },
  isPremium:{
    type: Boolean,
    min: 0,
    default: false
  },
  isVerified:{
    type: Boolean,
    default: false
  }
}, {timestamps: true});

export default mongoose.model('User', userSchema);