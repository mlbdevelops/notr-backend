import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId || String,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId || String,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Like', schema, 'likes');
