import Router from 'express';
import nodemailer from 'nodemailer';
import UnVerifiedUsers from '../../db/schemas/unVerifiedEmails.js';
import crypto from 'crypto';
import User from '../../db/schemas/userSchema.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'

dotenv.config()

const router = Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

function generatePassword() {
  return Math.round(Math.random() * 1e6);
}

async function sendEMail(email, code) {
  const mailOptions = {
    from: `"Notr" <${process.env.APP_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #111; background-color: #fff; border-radius: 8px; border: 1px solid #ddd;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="http://localhost:3000/background_less_logo.png" alt="Notr Logo" style="width: 120px;"/>
          <h2 style="color: #000;">Welcome to Notr</h2>
        </div>
    
        <p>Hi there,</p>
        <p>Thanks for signing up for <strong>Notr</strong>. To complete your registration, please verify your email by entering the code below:</p>
    
        <div style="margin: 20px 0; text-align: center;">
          <span style="display: inline-block; padding: 15px 25px; font-size: 24px; font-weight: bold; color: #000; background-color: #f1f1f1; border-radius: 6px; border: 1px solid #ccc;">${code}</span>
        </div>
    
        <p>Enter this code in the app to activate your account. The code is valid for <strong>15 minutes</strong>.</p>
        <p>If you did not request this email, you can safely ignore it.</p>
    
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;"/>
    
        <p style="font-size: 12px; color: #555;">Need help? Contact our support team at <a href="mailto:${process.env.APP_EMAIL}" style="color: #111;">${process.env.APP_EMAIL}</a></p>
        <p style="font-size: 12px; color: #555;">&copy; ${new Date().getFullYear()} Notr. All rights reserved.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) { 
      console.log(err);
    }
    return info;
  });
}

router.post('/api/createCode/email', async (req, res) => {
  try{
    const { email } = req.body;
    const code = generatePassword();
    
    const checkIfUserExists = await User.findOne({
      email: email
    });
    console.log(checkIfUserExists);
    if (checkIfUserExists?._id) {
      return res.status(401).send({
        msg: 'This email is already registered. Try another one'
      });
    }
    const check = await UnVerifiedUsers.find({email: email});
    
    if (check.length >= 1) {
      for(let email of check){
        await UnVerifiedUsers.findByIdAndDelete(email._id);
      }
    }
    const saveUnverified = new UnVerifiedUsers({
      email: email,
      code: await bcrypt.hash(String(code), 10)
    });
    const saved = await saveUnverified.save();
    if (saved._id) {
      sendEMail(email, code);
      return res.status(200).send({
        isSuccess: true
      });
    }
  }catch(err){
    console.log(err);
  }
});

router.post('/api/verify/email', async (req, res) => {
  try{
    const { email, code } = req.body;
    const saveUnverified = await UnVerifiedUsers.findOne({email: email});
    const decode = await bcrypt.compare(code, saveUnverified.code)
    if (decode) {
      res.status(200).send({
        msg: 'successfully verified ✓',
        isSuccess: true
      });
      return await UnVerifiedUsers.deleteOne({email: email});
    }
    
    return res.status(404).send({
      msg: 'Incorrect code',
      isSuccess: false
    });
  }catch(err){
    console.log(err);
  }
});

export default router;