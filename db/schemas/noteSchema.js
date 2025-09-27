import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  ownerId: {
    type: String,
    min: 0,
    required: true
  },
  title: {
    type: String,
    min: 0,
    required: true
  },
  note: {
    type: String,
    min: 0
  },
  tag: {
    type: String,
    min: 0
  },
  isPrivate: {
    type: Boolean,
    default: false,
    min: 0
  },
}, {timestamps: true});

export default mongoose.model('Note', schema, 'notes');