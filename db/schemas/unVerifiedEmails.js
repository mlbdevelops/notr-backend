import mongoose from 'mongoose';

const shema = new mongoose.Schema({
  email:{
    type: String,
    min: 0, 
    required: true
  },
  code:{
    type: String,
    min: 0, 
    required: true
  }
});

export default mongoose.model('UnVerifiedUsers', shema, 'UnVerifiedUsers');