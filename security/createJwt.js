import jwt from 'jsonwebtoken';

export default function createJwt(userId){
  return jwt.sign({id: userId}, process.env.JWT_SECRET_CODE);
}