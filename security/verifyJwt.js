import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next){
  try{
    const token = req.header('token');
    if (!token) return res.status(401).send({
      msg: 'Unothorized.',
    });
    const decode = jwt.verify(token, process.env.JWT_SECRET_CODE);
    req.user = decode;
    next();
  }catch(err){
    console.log(err);
  }
}