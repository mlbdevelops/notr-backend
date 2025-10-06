import Router from 'express';
import multer from 'multer';
import { File } from 'buffer';
import PocketBase from 'pocketbase'
import Post from '../../db/schemas/postSchema.js'
import Like from '../../db/schemas/likesSchema.js'
import Comment from '../../db/schemas/commentsSchema.js'
import User from '../../db/schemas/userSchema.js'
import mongoose from 'mongoose'
import cloudinary from '../../cloudinary.js'
import verifyToken from '../../security/verifyJwt.js'
import jwt from 'jsonwebtoken'

const router = Router();
const db = new PocketBase('http://127.0.0.1:8090')

const upload = multer({ storage: multer.memoryStorage() });

router.get("/api/posts/getPosts", verifyToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const cursor = req.query.cursor;
    const userId = req.user.id;
    let query = {};
    if (cursor) {
      query = { _id: { $lt: new mongoose.Types.ObjectId(cursor) } };
    }
    const posts = await Post.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "like"
        }
      },
      {
        $addFields: {
          likeCount: { $size: "$like" },
          likedByUser: userId
            ? { $in: [new mongoose.Types.ObjectId(userId), "$like.user"] }
            : false
        }
      },
      { $project: { like: 0 } }
    ]);
    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();
    res.status(200).json({
      posts,
      nextCursor: hasMore ? posts[posts.length - 1]._id : null,
      hasMore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

//Create post

router.post('/api/posts/post', verifyToken, upload.array('files', 15), async (req, res) => {
  try {
  const files = req.files;
  const {
    tag,
    note,
    title,
    fontFamily,
    textAlign,
    fontStyle,
    fontWeight
  } = req.body;
  
  // Upload all images to Cloudinary in parallel  
  const uploadPromises = files.map(file => {  
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;  
    return cloudinary.uploader.upload(dataUri, {  
      folder: 'posts',  
      resource_type: 'auto',  
    });  
  });  
  
  const results = await Promise.all(uploadPromises);  
  const urls = results.map(r => r.secure_url);  
  
  const getUserInfo = await User.findById(req.user.id);  
  
  const postModel = {  
    tag,  
    note,  
    title,  
    owner: {  
      _id: req.user.id,  
      username: getUserInfo.username  
    },  
    photosUrls: urls,  
    userProfile: getUserInfo.photoUrl,  
    fontFamily,  
    textAlign,  
    fontStyle,  
    fontWeight,  
    user: req.user.id  
  };  
  
  const create_doc = new Post(postModel);  
  await create_doc.save();  
  
  res.status(201).json({ message: 'Post created successfully', post: postModel });
  
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong while creating the post' });
  }
});

//Like a post

router.post('/api/post/like', verifyToken, async (req, res) => {
  try {
    const { postId } = req.body;
    const user = req.user.id;
    const existing = await Like.findOne({ postId, user });
    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      console.log('Unliked');
      return res.status(200).json({ res: 'unliked' });
    }
    const newLike = new Like({ postId, user });
    await newLike.save();
    console.log('Liked');
    res.status(200).json({ res: 'liked' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//add a comment

router.post('/api/posts/comments', verifyToken, async (req, res) => {
  try {
    const { postId, text } = req.body;
    const user = req.user.id;
    const commentOwner = await User.findOne({_id: user});
    console.log(commentOwner);
    const commentModel = {
      postId: postId,
      user: {
        _id : user,
        username: commentOwner?.username
      },
      text: text
    };
    const create = new Comment(commentModel);
    console.log(create);
    if (create?.text) {
      const savedComment = await create.save();
      res.status(201).send({
        addedComment: savedComment
      });
    }
  } catch (error) {
    console.error(error);
  }
});

//get a specific post's comments

router.get('/api/posts/GetComments/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user.id;
    if (!user) {
      res.status(403).send({
        comments:[{
          user: 'Notr',
          text: "Login to perform this action.",
          postId: postId
        }]
      });
    }
    const findComment = await Comment.find({postId : postId});
    if (findComment.length >= 1) {
      return res.status(200).send({
        comments: findComment
      });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
  }
});

//delete a post

router.delete('/api/posts/delete/:postId', verifyToken, async (req, res) => {
  try{
    const postId = req.params.postId;
    const user = req.user.id;
    if (!postId) {
      return;
    }
    const findPost = await Post.findOne({
      _id: postId,
      user: user
    });
    if (findPost?._id) {
      await Post.deleteOne(findPost);
    }
    res.status(200).send({
      msg: 'Post deleted.'
    });
  }catch(err){
    console.log(err);
  }
});

router.post("/upload-multiple", upload.array("files", 5), async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) => {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      return cloudinary.uploader.upload(dataUri, {
        folder: "posts",
        resource_type: "auto",
      });
    });
    const results = await Promise.all(uploadPromises);
    const urls = results.map((r) => r.secure_url);
    res.status(200).json({ uploaded: urls });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Upload failed" 
    });
  }
});

export default router;