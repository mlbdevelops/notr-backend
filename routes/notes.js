import { Router } from 'express';
import Note from '../db/schemas/noteSchema.js';
import Password from '../db/schemas/privateNotesSchema.js';
import bcrypt from 'bcryptjs'
import verifyToken from '../security/verifyJwt.js'

const router = Router();

router.get('/api/getTest', (req, res) => {
  res.send({
    msg: 'Hello bro'
  });
})

router.get('/api/getNotes', verifyToken, async (req, res) => {
  try{
    const notes = await Note.find({
      ownerId: req.user.id,
      isPrivate: false
    }).sort({updatedAt: -1});
    
    res.status(200).send({
      response: notes,
      isSuccess: true,
    });
  }catch(err){
    console.log(err);
  }
});

router.post('/api/addNote', verifyToken, async (req, res) => {
  try{
    const ownerId = req.user.id;
    const { title } = req.body;
    if (!ownerId) {
      return res.status(403).send({
        isSuccess: false,
        msg: 'Login to add notes.'
      });
    }
    
    if (!title) {
      return res.status(403).send({
        isSuccess: false,
        msg: 'A title is required.'
      });
    }
    
    const newNote = new Note({
      ownerId : ownerId,
      title : title,
      note: '',
      tag: '',
      fontStyle: '',
      fontFamily: '',
      fontWeight: '',
      textAlign: '',
      isPrivate: false
    });
    
    const savedNote = await newNote.save();
    
    res.status(201).send({
      response: savedNote,
      isSuccess: true,
    });
  }catch(err){
    console.log(err);
  }
});

router.get('/api/getIndividualNote/:noteId', verifyToken, async (req, res) => {
  try{
    const { noteId } = req.params;
    const ownerId = req.user.id;
    if (!ownerId) {
      return;
    }
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(403).send({
        isSuccess: false,
        msg: 'No note found, try another one'
      });
    }
    console.log(note)
    res.status(200).send({
      isSuccess: true,
      response: note
    });
  }catch(err){
    console.log(err);
  }
});

router.patch('/api/saveNote/:noteId', verifyToken, async (req, res) => {
  try{
    const { noteId } = req.params;
    const updatedNote = {
      title: req.body.title,
      note: req.body.note,
      tag: req.body.tag,
      fontStyle: req.body.fontStyle,
      textAlign: req.body.textAlign,
      fontFamily: req.body.fontFamily,
      fontWeight: req.body.fontWeight,
      isPrivate: req.body.isPrivate,
    };
    const getNote = await Note.findByIdAndUpdate(noteId, updatedNote, {
      new: true,
      runValidators: true
    });
    
    res.status(200).send({
      response: getNote,
      isSuccess: true
    });
  }catch(err){
    console.log(err)
  }
});

router.delete('/api/delete/:noteId', verifyToken, async (req, res) => {
  try{
    if (!req.user.id) {
      return;
    }
    const { noteId } = req.params;
    const find = await Note.findByIdAndDelete(noteId);
    res.status(200).send({
      isSuccess: true,
      msg: 'Succesfully deleted'
    });
  }catch(err){
    console.log(err)
  }
});

router.get('/api/notes/privateNotes', verifyToken, async (req, res) => {
  try{
    const find = await Note.find({
      isPrivate: true,
      ownerId: req.user.id
    }).sort({updatedAt: -1});
    res.status(200).send({
      isSuccess: true,
      response : find,
    });
  }catch(err){
    console.log(err)
  }
});

router.get('/api/notes/getPass', verifyToken, async (req, res) => {
  try{
    const userId = req.user.id;
    const find = await Password.find({user: userId});
    if (find.length >= 1) {
      return res.status(200).send({msg: 'Enter your password.'});
    }
    res.status(200).send({msg: 'Set a new password.'});
  }catch(err){
    console.log(err)
  }
});

router.post('/api/notes/password', verifyToken, async (req, res) => {
  try{
    const userid = req.user.id;
    const pssw = req.body.password;
    const setPswd = await Password.findOne({user: userid});
    if (!setPswd?._id) {
      const newPassword = new Password({
        user: userid,
        password : await bcrypt.hash(pssw, 10)
      });
      console.log(newPassword);
      await newPassword.save();
      if (newPassword) {
        return res.status(201).send({
          isSuccess: true,
          msg: 'Your password has succesfully been set'
        });
      }
      return;
    }
    const check = await bcrypt.compare(pssw, setPswd.password);
    if (check) {
      return res.status(200).send({response: check});
    }
    return res.send(false);
  }catch(err){
    console.log(err);
  }
});

router.post('/api/notes/setAllAsPublic', verifyToken, async (req, res) => {
  try {
    const userid = req.user.id;
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
      return;
    }
    
    const updateList = updates.map(up => ({
      updateOne: {
        filter: {
          _id: up._id,
          ownerId: userid
        },
        update: {
          $set: up
        }
      }
    }));
    
    const updated = await Note.bulkWrite(updateList);
    res.status(200).send({msg: 'Succesfully set them to public'});
  } catch (error) {
    console.error(error);
    res.status(500).send({msg: 'Internal server error'});
  }
});

export default router;