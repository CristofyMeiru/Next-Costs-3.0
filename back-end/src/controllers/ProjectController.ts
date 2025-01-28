import { Request, Response } from "express";
import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import { IAuthToken } from "../models/RefreshModel";
import Project from "../models/ProjectModel";
require("dotenv").config();

class ProjectControllerGET {
  public async getAll(req: Request, res: Response) {
    const allProjects = await Project.find();
    return res.status(200).json({ allProjects });
  }
  public async getById(req: Request, res: Response) {
    const { id } = req.params;

    const projectRequired = await Project.findById(id);

    if (!projectRequired) {
      return res.status(400).json({ message: "Project not found." });
    }

    return res.json({ message: "Project found.", projectRequired });
  }
  public async getByUser(req: Request, res: Response) {
    const { username } = req.params;
    const userOwner = await User.findOne({username})

    if(!userOwner){
      return res.status(404).json({message: "User not found."})
    }

    const allProjects = await Project.find({author: userOwner.id})
    
    return res.status(200).json({ message: "Succesfully query.", allProjects });
  }
}

class ProjectControllerPOST {
  public async create(req: Request, res: Response) {
    try {
      const secret = String(process.env.SECRET_KEY);
      const { title, category, content } = req.body;
      const authToken = req.headers.authorization?.split(" ")[1];

      if (!title || !category || !content) {
        return res
          .status(400)
          .json({ message: "Something missing. Please try again." });
      }
      if (!authToken) {
        return res.status(401).json({ message: "Authenticate first." });
      }

      const authPayload = jwt.verify(authToken, secret) as IAuthToken;
      const userExist = await User.findById(authPayload.userID);
      if (!userExist) {
        return res
          .status(400)
          .json({ message: "User not exist, Log in first." });
      }
      const newProject = new Project({
        title,
        category,
        content,
        author: authPayload.userID,
      });
      await newProject.save();
      return res.json({ message: "Project succesfully added." });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong. Please try again later." });
    }
  }
  public async deleteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const secret = String(process.env.SECRET_KEY);
      const authToken = req.headers.authorization?.split(" ")[1];

      if (!id || !authToken) {
        return res.status(400).json({ message: "Missing data." });
      }
      const authTokenPayload = jwt.verify(authToken, secret) as IAuthToken;
      const projectTarget = await Project.findById(id);

      if (!projectTarget) {
        return res.status(400).json({ message: "Project not found." });
      }

      if (authTokenPayload.userID != String(projectTarget.author)) {
        return res.status(401).json({ message: "Unauthorized access." });
      }

      await Project.findByIdAndDelete(id);
      return res.status(204).json({ message: "Project successfully deleted" });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong, try again later." });
    }
  }
}

export const projectControllerGET = new ProjectControllerGET();
export const projectControllerPOST = new ProjectControllerPOST();
