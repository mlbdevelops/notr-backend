import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  postId:{
    type: String,
    required: true
  },
  user :{
    type: Object,
    required: true
  },
  text:{
    type: String,
    required: true
  }
}, {timestamps: true});

export default mongoose.model('Comment', schema, 'comments');