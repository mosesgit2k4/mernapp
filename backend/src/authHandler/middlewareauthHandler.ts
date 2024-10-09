import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { secret_token } from '../config/dotenv';
import User from '../model/usermodel';
import { Types } from 'mongoose';
import responsemessage from '../responsemessage';

export interface AuthenticatedRequest extends Request {
  profileid?: Types.ObjectId;
}


const usersSessionHandler = async (req: AuthenticatedRequest, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  let jwtToken;

  if (authHeader) {
    jwtToken = authHeader.split(' ')[1];
  }

  if (!jwtToken) {
    return res.status(401).json({ message: responsemessage.nojwttoken });
  }
  try {
    const jwtpayload = verify(jwtToken, secret_token) as JwtPayload
    const user = await User.collection.findOne({ _id: new Types.ObjectId(jwtpayload._id) })
    if (!user) {
      return res.send(responsemessage.usernotfound).status(401)
    }
    req.profileid = user._id
    next()
  } catch (error) {
    console.log("JWT verification errror:", error)
    return res.status(500).json({ message: responsemessage.servererror })
  }
};

export default usersSessionHandler;
