require("dotenv").config();
import { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { genAuthToken, genRefreshToken } from "../config/TokensGen";
import RefreshToken from "../models/RefreshModel";


class UserControllerGET {
  public async getByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }
      return res.status(200).json({ message: "User found", user });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong. Try again later." });
    }
  }
  public async userData(req: Request, res: Response){
    try {
      const authToken = String(req.headers.authorization?.split(" ")[1]);
      const secret = String(process.env.SECRET_KEY);
      const contentToken = jwt.decode(authToken) as any;
      const user = await User.findById(contentToken.userID);
      if (!user) {
        return res.json({ message: "User cannot be find." });
      }
      return res.json({ user });
    } catch (err){
      return res.status(400).json({message: "Something wrong. Please try again later."})
    }
  }
}

class UserControllerPOST {
  public async registerUser(req: Request, res: Response) {
    const unusableNames = ["register", "auth", "home"] 
    const saltRounds: number = Number(process.env.SALT_ROUNDS);
    try {
      const { username, email, pass, confirm_pass } = req.body;
      if (!username || !email || !pass || !confirm_pass) {
        res
          .status(400)
          .json({ message: "Something missing. Please try again." });
      }
      if(unusableNames.includes(username)){
        return res.status(409).json({message: "Unusable username, please choose another."})
      }
      const userExists = await User.findOne({username})
      if(userExists){
        return res.status(409).json({message: "User already exists."})
      }
      if (pass !== confirm_pass) {
        return res.status(400).json({ message: "Passwords don't match." });
      }
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPass = await bcrypt.hash(pass, salt);

      const newUser = new User({
        username,
        email,
        pass: hashedPass,
      });
      await newUser.save();
      return res.status(201).json({ message: "User successfully registered." });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong. Try again later." });
    }
  }
  public async auth(req: Request, res: Response) {
    try {
      const { username, pass } = req.body; 
      if (!username || !pass) {
        return res
          .status(400)
          .json({ message: "Something missing. Please, try again." });
      }
      const user = await User.findOne({ username }).select("+pass");
      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }
      const isAuth = await bcrypt.compare(pass, user.pass);
      if (!isAuth) {
        return res.status(200).json({ message: "Username or pass incorrect." });
      }
      const authToken = await genAuthToken(user.id)
      const refreshToken = await genRefreshToken(user.id)

      const newRefresh = new RefreshToken({
        payload: refreshToken,
        user: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
      })
      newRefresh.save()
      res.cookie('refreshToken', refreshToken,  {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      return res.status(200).json({message: "Log in successful.", authToken})
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong. Try again later." });
    } 
  }
  //Rota de endpoint para renovar o authToken
  public async refreshAuth(req: Request, res: Response){
    try {
        const secret = String(process.env.SECRET_KEY)
        const refreshToken = req.cookies['refreshToken']
        if(!refreshToken){
          return res.status(401).json({message: "Invalid access, log in first."})
        }
        jwt.verify(refreshToken, secret) //A propria verificação retorna erro automaticamente
        const refreshFromDB = await RefreshToken.findOne({payload: refreshToken})
        if(!refreshFromDB){
          return res.status(401).json({message: "Denied access."})
        }
        if(refreshFromDB.expiresAt < new Date()){
          await RefreshToken.findOneAndDelete({payload: refreshFromDB.payload})
          return res.status(401).json({message: "Invalid access, log in first."})
        }
        const newAuthToken = await genAuthToken(refreshFromDB.user)
        return res.status(200).json({authToken: newAuthToken})
    } catch (err){
      return res
        .status(401)
        .json({ message: "Expired session." });
    }
  }
}
export const userControllerGET = new UserControllerGET();
export const userControllerPOST = new UserControllerPOST();
