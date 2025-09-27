import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title:{
    type: String,
    min: 0,
  },
  note: {
    type: String,
    min: 0,
    required: true
  },
  tag: {
    type: String,
    min: 0,
  },
  photosUrls:{
    type : Array,
    min: 0
  },
  owner:{
    type: Object,
    min : 0,
    required: true
  },
  user:{
    type: String,
    min: 0,
    required: true
  },
  userProfile: {
    type: String
  },
  fontStyle:{
    type: String,
    min : 0,
    default: 'normal'
  },
  fontWeight:{
    type: String,
    min : 0,
    default: 'normal'
  },
  textAlign:{
    type: String,
    min : 0,
    default: 'left'
  },
  fontFamily:{
    type: String,
    min : 0,
    default : 'Arial'
  },
}, {timestamps: true});

export default mongoose.model('Post', schema, 'posts')