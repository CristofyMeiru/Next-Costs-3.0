import { Request, Response } from "express";
import User from "../models/UserModel";

class ProjectControllerGET {
  public async getAll(req: Request, res: Response) {
    res.json({ message: "Success!" });
  }
}

class ProjectControllerPOST {
  public async create(req: Request, res: Response) {
    try {
      const { title, category, content, user_id } = req.body();

      if (!title || !category || !content || !user_id) {
        return res
          .status(400)
          .json({ message: "Something missing. Please try again." });
      }
      const userExist = await User.findById({ user_id });
      if (!userExist) {
        return res
          .status(400)
          .json({ message: "User not exist, Log in first." });
      }
      
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong. Please try again later." });
    }
  }
}

export const projectControllerGET = new ProjectControllerGET();
export const projectControllerPOST = new ProjectControllerPOST();
