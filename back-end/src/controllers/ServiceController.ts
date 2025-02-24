import { Request, Response } from "express";
import Service from "../models/ServiceModel";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
require("dotenv").config();

class ServiceControllerGET {
  public async getServicesByProjectId(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const allServicesByProject = await Service.find({
        project_id: projectId,
      });
      if (!allServicesByProject) {
        return res.status(404).json({ message: "Project not found." });
      }
      return res.status(200).json({ allServicesByProject });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong, try again later." });
    }
  }
}

class ServiceControllerPOST {
  public async createService(req: Request, res: Response) {
    const authToken = req.headers.authorization?.split(" ")[1] || "";
    const { service_name, cost, description, project_id } = req.body;

    if (!service_name || !cost || !description || !project_id) {
      return res
        .status(400)
        .json({ message: "Something missing, enter valid values." });
    }

    const tokenPayload = jwt.decode(authToken);
    //Inacabada
  }
  public async deleteService(req: Request, res: Response) {
    try {
        const secret = process.env.SECRET_KEY as jwt.Secret
      const { service_id } = req.params;
      const authToken = req.headers.authorization?.split(" ")[1];
      if (!service_id || !authToken) {
        return res
          .status(400)
          .json({ message: "Something missing, enter valid values." });
      }
      const authTokenPayload = jwt.verify(authToken, secret)

      return res.json({authTokenPayload})
      //Inacabada
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something wrong, please try again later." });
    }
  }
}

export const serviceControllerGET = new ServiceControllerGET();
export const serviceControllerPOST = new ServiceControllerPOST();
