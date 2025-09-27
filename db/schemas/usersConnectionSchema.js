import mongoose from 'mongoose';

const shema = new mongoose.Schema({
  user:{
    type: String,
    required: true
  },
  connectedTo:{
    type: String,
    required: true
  },
}, {timestamps: true});

export default mongoose.model('Connect', shema, 'connection');
