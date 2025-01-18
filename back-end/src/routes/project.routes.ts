import { Router } from "express";
import { projectControllerGET } from "../controllers/ProjectController";
import tokenMiddleware from "../middlewares/TokenMiddleware";

const projectRoutes = Router();

projectRoutes.get(
  "/",
  tokenMiddleware.checkAuthToken,
  projectControllerGET.getAll
);


export default projectRoutes;
