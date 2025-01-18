import { Request, Response, NextFunction } from "express";
import RefreshToken from "../models/RefreshModel";
import jwt from 'jsonwebtoken'
import { genAuthToken } from "../config/TokensGen";
require('dotenv').config()

class TokenMiddleware {
  public async checkAuthToken(req: Request, res: Response, next: NextFunction) {
    const secret = String(process.env.SECRET_KEY)
    try {
      const authToken = req.headers.authorization?.split(' ')[1]
      if(!authToken){
        return res.status(401).json({message: "Session expired."})
      }
      jwt.verify(authToken, secret)
      next()
    } catch (err){
      return res.status(401).json({message: "Something wrong, try again later."})
    }
  }
}

const tokenMiddleware = new TokenMiddleware();
export default tokenMiddleware;
