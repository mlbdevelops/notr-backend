import express from 'express';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../db/schemas/userSchema.js';
import Note from '../../db/schemas/noteSchema.js';
import createJwt from '../../security/createJwt.js';

const router = Router();

router.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      email,
      password,
      name,
      username,
      age
    } = req.body;
    
    const randInt = [
      Math.round(Math.random() * 1e1),
      Math.round(Math.random() * 1e2),
      Math.round(Math.random() * 1e3),
    ];
    
    if (!email || !password) {
      return res.status(403).send({ msg: 'Email and password are required' });
    }
    
    const symbols = ['.', '_'];
    
    const user = {
      email : email,
      password : await bcrypt.hash(password, 10),
      name: name,
      username: `${username.trim().replace(' ', symbols[Math.round(Math.random() * symbols.length)]).toLowerCase()}${randInt[Math.round(Math.random() * randInt.length)]}`,
      age: age,
      bio: '',
      isPrivate: age >= 18? false : age <= 17? true : false
    };
    if (user) {
      const newUser = new User(user);
      const savedUser = await newUser.save();
      res.status(201).send({
        response: savedUser,
        isSuccess: true,
        token: createJwt(newUser._id),
        msg: `Welcome ${newUser.username}`
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: 'Something bad happened, please try again'
    });
  }
});

export default router;
