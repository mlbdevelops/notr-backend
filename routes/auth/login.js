import { Router } from 'express';
import User from '../../db/schemas/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UnVerifiedUsers from '../../db/schemas/unVerifiedEmails.js';
import createJwt from '../../security/createJwt.js';

const router = Router();
router.post('/api/auth/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    const findEmail = await UnVerifiedUsers.findOne({email: email});
    if (findEmail) {
      if (findEmail.email == email) {
        // for future server and app update
        
        //return res.status(400).send({
          //msg: 'User is not verified'
        //});
        await User.deleteOne({
          email: email
        });
      }
    }
    if ((!email && !password) || (!email || !password)) {
      return res.status(400).send({ msg : 'Invalid credentials.'});
    }
    const user = await User.findOne({email: email}).select('+password');
    if (!user) {
      return res.status(404).send({ msg : 'User not found.'});
    }
    const decryptPssw = await bcrypt.compare(password, user.password);
    
    if (decryptPssw) {
      return res.status(200).send({
        response: user,
        isSuccess: true,
        token: decodeURIComponent(createJwt(user._id)),
        msg: `Welcome back ${user.username}`
      });
    }
    return res.status(404).send({ 
      msg: 'Wrong password!',
      isSuccess: false
    });
  }catch(err){
    console.table(err);
  }
});
export default router;