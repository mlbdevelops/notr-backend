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
  try {
    const { query } = req.body;
    const limit = parseInt(req.query.limit) || 15;
    const cursor = req.query.cursor;
    const userId = req.user.id;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: "Query is required" });
    }
    let postMatch = {
      note: { $regex: query, $options: "i" },
    };

    if (cursor) {
      postMatch._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const posts = await Post.aggregate([
      { $match: postMatch },
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
    
    const users = await User.aggregate([
      {
        $match: {
          username: { $regex: `^${query}`, $options: "i" },
          isPrivate: { $eq: false }
        }
      },
      { $limit: 10 },
      {
        $project: {
          password: 0,
          email: 0,
          __v: 0
        }
      }
    ]);
    res.status(200).json({
      posts,
      users,
      nextCursor: hasMore ? posts[posts.length - 1]._id : null,
      hasMore
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
