import Router from 'express';  
import nodemailer from 'nodemailer';  
import UnVerifiedUsers from '../../db/schemas/unVerifiedEmails.js';  
import User from '../../db/schemas/userSchema.js';  
import dotenv from 'dotenv';  
import bcrypt from 'bcryptjs';  
  
dotenv.config();  
const router = Router();  

const transporter = nodemailer.createTransport({  
  host: process.env.SMTP_HOST,  
  port: process.env.SMTP_PORT,  
  secure: process.env.SMTP_SECURE === 'true',
  auth: {  
    user: process.env.SMTP_USER,  
    pass: process.env.SMTP_PASS,  
  },  
});  
  
function generatePassword() {  
  return Math.floor(Math.random() * 1e6);  
}  
  

async function sendEMail(email, code) {  
  try {  
    const mailOptions = {  
      from: process.env.APP_EMAIL,  
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
      `,  
    };  
  
    const info = await transporter.sendMail(mailOptions);  
    console.log('Email sent:', info.messageId);  
  } catch (err) {  
    console.error('Nodemailer Error:', err);  
  }  
}  
  
router.post('/api/createCode/email', async (req, res) => {  
  try {  
    const { email } = req.body;  
    const code = generatePassword();  
  
    const checkIfUserExists = await User.findOne({ email });  
    if (checkIfUserExists?._id) {  
      return res.status(401).send({ msg: 'This email is already registered. Try another one' });  
    }  
  
    const check = await UnVerifiedUsers.find({ email });  
    if (check.length >= 1) {  
      for (let e of check) {  
        await UnVerifiedUsers.findByIdAndDelete(e._id);  
      }  
    }  
  
    const saveUnverified = new UnVerifiedUsers({  
      email,  
      code: await bcrypt.hash(String(code), 10),  
    });  
    const saved = await saveUnverified.save();  
  
    if (saved._id) {  
      await sendEMail(email, code);  
      return res.status(200).send({ isSuccess: true });  
    }  
  } catch (err) {  
    console.error(err);  
    return res.status(500).send({ msg: 'Server error' });  
  }  
});  
  
router.post('/api/verify/email', async (req, res) => {  
  try {  
    const { email, code } = req.body;  
    const saveUnverified = await UnVerifiedUsers.findOne({ email });  
    const decode = await bcrypt.compare(code, saveUnverified.code);  
  
    if (decode) {  
      await UnVerifiedUsers.deleteOne({ email });  
      return res.status(200).send({ msg: 'successfully verified ✓', isSuccess: true });  
    }  
  
    return res.status(404).send({ msg: 'Incorrect code', isSuccess: false });  
  } catch (err) {  
    console.error(err);  
    return res.status(500).send({ msg: 'Server error' });  
  }  
});  
  
export default router;