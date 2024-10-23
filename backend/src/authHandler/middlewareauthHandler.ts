import { Request, Response, NextFunction, response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { secret_token } from '../config/dotenv';
import { User } from '../model/usermodel';
import { Types } from 'mongoose';
import responsemessage from '../responsemessage';
import CustomError from './errorhandling';

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
     res.status(401)
     throw new CustomError(responsemessage.nojwttoken,401)
  }
  try {
    const jwtpayload = verify(jwtToken, secret_token) as JwtPayload
    const user = await User.collection.findOne({ _id: new Types.ObjectId(jwtpayload._id) })
    if (!user) {
       res.status(401)
       throw new CustomError(responsemessage.usernotfound,401)
    }
    req.profileid = user._id
    next()
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message});
  } else {
      console.error("Error:", error);
      res.status(500).json({ message: responsemessage.servererror });
  }
  }
};

export default usersSessionHandler;
