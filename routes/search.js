import Router from 'express';
import User from '../db/schemas/userSchema.js';
import Note from '../db/schemas/noteSchema.js';
import Post from '../db/schemas/postSchema.js';
import Like from '../db/schemas/likesSchema.js';
import Connect from '../db/schemas/usersConnectionSchema.js';
import verifyToken from '../security/verifyJwt.js';
import mongoose from 'mongoose';

const router = Router();

router.post('/api/postsOrusers/search', verifyToken, async (req, res) => {
  try{
    const { query } = req.body;
    console.log(req.user)
    console.log(query)
    if (!query) {
      return;
    }
    const users = await User.find();
    const limit = parseInt(req.query.limit) || 15;
    const cursor = req.query.cursor;
    const userId = req.user.id;
    let srch = {};
    if (cursor) {
      srch = { _id: { $lt: new mongoose.Types.ObjectId(cursor) } };
    }
    const posts = await Post.aggregate([
      { $match: srch },
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
    
    const filteredUsers = users.filter(u => u.username.toLowerCase().startsWith(query.toLowerCase()));
    
    res.status(200).send({
      posts,
      nextCursor: hasMore ? posts[posts.length - 1]._id : null,
      hasMore,
      users: filteredUsers
    });
  }catch(err){
    console.log(err);
  }
});

export default router;
