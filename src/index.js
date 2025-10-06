import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import connectDB from '../db/dbConnection.js';
import User from '../db/schemas/userSchema.js';
// Import all route folders
import loginRoute from '../routes/auth/login.js';
import registerRoute from '../routes/auth/register.js';
import verificationRoute from '../routes/auth/verification.js';
import postsRoute from '../routes/postRoutes/post.js';
import searchRoute from '../routes/search.js';
import noteRoutes from '../routes/notes.js';
import userRoutes from '../routes/user.js';

import { GoogleGenAI } from '@google/genai';

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-9f4ad86e0bf244c5a94140307a325047',
});


dotenv.config();
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

// Auth routes
app.use(loginRoute);
app.use(registerRoute);
app.use(verificationRoute);

// Posts
app.use(postsRoute);

// Search
app.use(searchRoute);

// Notes
app.use(noteRoutes);
app.use(userRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send({
    msg: 'Hello'
  })
})

app.get('/api/gemini', async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: "what's the date of today? Format them as a JSON array of strings." }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
    });

    let text = response.candidates[0].content.parts[0].text;
    text = text.replace(/```json|```/g, "").trim();

    let quotes;
    try {
      quotes = JSON.parse(text);
    } catch {
      quotes = text.split(/\n+/).map(line => line.replace(/^[-\d\.\s"]+/, "").trim()).filter(Boolean);
    }

    res.status(200).send(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch from Gemini API" });
  }
});

app.use((req, res, next) => {
  res.send('Unavailable route.')
  next()
})

export default app;
//app.listen(process.env.PORT || 3001, () => console.log(`Local server running on port ${3001}`));
