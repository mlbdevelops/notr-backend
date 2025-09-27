import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  reportedPostId: {type: mongoose.Schema.Types.ObjectId, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, required: true},
  reportType: {type: mongoose.Schema.Types.ObjectId, required: true},
}, {timestamps: true});

export default mongoose.model('Report', schema, 'reportedPosts');