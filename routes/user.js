import { Router } from 'express';
import User from '../db/schemas/userSchema.js';
import Note from '../db/schemas/noteSchema.js';
import Post from '../db/schemas/postSchema.js';
import Like from '../db/schemas/likesSchema.js';
import Connect from '../db/schemas/usersConnectionSchema.js';
import multer from 'multer';
import PocketBase from 'pocketbase';
import mongoose from 'mongoose';
import verifyToken from '../security/verifyJwt.js';
import cloudinary from '../cloudinary.js';
import Comment from '../db/schemas/commentsSchema.js'
const router = Router();
const db = new PocketBase('http://127.0.0.1:8090');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/api/getUserInfo', verifyToken, async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(403).send({
        isSuccess: false,
        response: 'User id is required.'
      });
    }
    const connections = await Connect.find({
      connectedTo : id
    });
    
    const notes = await Note.find({ownerId: id});
    const posts = await Post.aggregate([
      {
        $match: { user: id }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 15 },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "like"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user", 
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $addFields: {
          likeCount: { $size: "$like" },
          likedByUser: id
            ? { $in: [new mongoose.Types.ObjectId(id), "$like.user"] }
            : false,
          user: { $first: "$user" } 
        }
      },
      {
        $project: {
          like: 0,
          "user.password": 0,
          "user.email": 0,
        }
      }
    ]);
    res.status(200).send({
      user: await User.findById(id),
      notes: notes.length,
      posts: posts, 
      connections: connections.length
    });
  } catch (error) {
    console.error(error);
  }
});

router.delete('/api/delete', verifyToken, async (req, res) => {
  const userid = req.user.id;
  try {
    const result = await Note.deleteMany({ownerId: userid});
    const delete_user = await User.findByIdAndDelete(userid);
    const deletePosts = await Post.deleteMany({user: userid});
    const deleteComments = await Comment.deleteMany({'user._id': userid});
    const deleteLikes = await Like.deleteMany({user: userid});
    res.status(200).send({
      isSuccess: true,
      response: 'Your account has successfully been deleted'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting notes or user');
  }
});

router.post('/api/users/connect', verifyToken, async (req ,res) => {
  try {
    
    const { connect } = req.body;
    //const { userId } = req.params;
    const userId = req.user.id
    const check = await Connect.findOne({
      user: userId,
      connectedTo: connect
    });
    if (check?._id) {
      await Connect.deleteOne({
        user: userId,
        connectedTo: connect
      });
      return res.status(200).send({
        msg: 'disconnected'
      });
    }
    const connection = new Connect({
      user: userId,
      connectedTo: connect
    });
    await connection.save();
    res.status(200).send({
      msg: 'connected'
    });
  } catch (error) {
    console.error(error);
  }
});

router.get('/api/users/getOtherProfile/:id/logged/:loggedUser', async (req, res) => {
  try {
    const { id } = req.params;
    const { loggedUser } = req.params;
    
    if (!id) {
      return res.status(400).send({
        isSuccess: false,
        response: 'user id is required.'
      });
    }
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res.status(404).send({
        msg: 'This is account is temporarily unavailable or might have been deleted.'
      })
    }
    const connections = await Connect.find({
      connectedTo : id
    });
    const notes = await Note.find({ownerId: id});
    const posts = await Post.aggregate([
      {
        $match: { user: id }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 15 },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "like"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user", 
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $addFields: {
          likeCount: { $size: "$like" },
          likedByUser: loggedUser && loggedUser != 'null'
            ? { $in: [new mongoose.Types.ObjectId(loggedUser), "$like.user"] }
            : false,
          user: { $first: "$user" } 
        }
      },
      {
        $project: {
          like: 0,
          "user.password": 0,
          "user.email": 0,
        }
      }
    ]);
    res.status(200).send({
      user: foundUser,
      notes: notes.length,
      posts: posts, 
      connections: connections.length
    });
  } catch (error) {
    console.error(error);
  }
});

router.get('/api/users/knowConnection/:conn', verifyToken, async (req, res) => {
  try {
    const check = await Connect.findOne({
      connectedTo: req.params.conn,
      user: req.user.id
    });
    if (check?.user === req.user.id) {
      return res.status(200).send({
        msg: true
      });
    }
    res.status(200).send({
      msg: false
    });
  } catch (error) {
    console.error(error);
  }
});

router.patch('/api/users/editProfile', verifyToken, upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    let newPhotoUrl = req.body.actualPhoto || '';
    let newCoverUrl = req.body.actualCover || '';
    
    console.log([newCoverUrl, newPhotoUrl])
    
    if (req.files?.file?.[0]) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'profile' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.file[0].buffer);
      });
      newPhotoUrl = result.secure_url;
    }
    
    if (req.files?.cover?.[0]) {
      const coverResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'cover' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.cover[0].buffer);
      });
      newCoverUrl = coverResult.secure_url;
    }
    
    if (req.body.actualPhoto === 'removed') {
      newPhotoUrl = '';
    }
    
    if (req.body.actualCover === 'removed') {
      newCoverUrl = '';
    }
    const newUserData = {
      photoUrl: newPhotoUrl,
      bio: req.body.bio,
      name: req.body.name,
      role: req.body.role,
      coverUrl: newCoverUrl
    };
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: newUserData },
      { new: true }
    );
    
    await Post.updateMany(
      { user: userId },
      { $set: { userProfile: newPhotoUrl }}
    );
    
    await Comment.updateMany(
      { 'user._id': userId },
      { $set : { 'user.profile' : newPhotoUrl } }
    );
    
    res.status(200).json({
      msg: 'Profile updated.',
      newData: updatedUser
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Something went wrong', error: error.message });
  }
});

router.get('/api/user/isPrivate', verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return;
    }
    const user = await User.findById(id);
    
    if (user?._id) {
      res.status(200).send({
        isPrivate: user.isPrivate
      });
    }
  } catch (error) {
    console.error(error);
  }
});

router.post('/api/user/editIsPrivate', verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const isPrivate = req.body.isPrivate;
    if (!id) {
      return;
    }
    const edit = await User.findByIdAndUpdate(id,
      {$set : {isPrivate: isPrivate}},
      {new: true}
    );
    
    res.status(200).send({
      isPrivate: edit.isPrivate
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      err : 'Something went wrong, Try again later'
    })
  }
});

router.get('/user', (req, res) => {
  const { id } = req.query
  if (id) {
    return res.redirect(`https://notrapp.vercel.app/profile/profile?user=${id}`)
  }
})

export default router;
