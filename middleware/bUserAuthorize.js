
import bUser from '../models/businessUserM.js';
import JWT  from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();


// check weather the given request is vaild user request or not;

export async function bUserAuthorized(req,res,next) {
    try {
      const token = req.header('Authorization');
      
      if (!token) {
        res.status(401).json({ success: false, error: 'Unauthorized request. No token provided.' });
        return;
      }
  
      const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY || 'default');
      const buser = await bUser.findByPk(decodedToken.userID);
      
      if (!buser) {
        res.status(401).json({ success: false, error: 'Unauthorized request. Invalid token.' });
        return;
      }
      // console.log('user coming: ',user);
      
      req.buser = buser;  // You can now safely set req.user because of the type extension
      next();
    } catch (error) {    
      res.status(401).json({ success: false, error: 'Token verification failed.' });
      return;
    }
  }
  






