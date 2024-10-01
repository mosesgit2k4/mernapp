import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { secret_token } from '../config/dotenv';
import User from '../model/usermodel';

export interface AuthenticatedRequest extends Request {
  profileid?: string;
}


const usersSessionHandler = async (req: AuthenticatedRequest, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  let jwtToken;

  if (authHeader) {
    jwtToken = authHeader.split(' ')[1];
  }

  if (!jwtToken) {
    return res.status(401).json({ message: 'No JWT Token' });
  }

  try {
    const payload = verify(jwtToken, secret_token) as { user: { id: string } };
    const userdta = await User.findById(payload.user.id);

    if (userdta) {
      req.profileid = userdta.id;
      next();
    } else {
      return res.status(401).json({ message: 'Invalid JWT Token' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid JWT Token' });
  }
};

export default usersSessionHandler;
