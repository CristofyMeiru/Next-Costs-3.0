import { Router } from "express";
import {
  projectControllerGET,
  projectControllerPOST,
} from "../controllers/ProjectController";
import tokenMiddleware from "../middlewares/TokenMiddleware";

const projectRoutes = Router();

//Rotas GET
projectRoutes.get(
  "/",
  tokenMiddleware.checkAuthToken,
  projectControllerGET.getAll
);
projectRoutes.get(
  "/get_project_by_id/:id",
  tokenMiddleware.checkAuthToken,
  projectControllerGET.getById
);
projectRoutes.get(
  "/get_all_by_user/:username",
  tokenMiddleware.checkAuthToken,
  projectControllerGET.getByUser
);
//Rotas POST
projectRoutes.post(
  "/create_project",
  tokenMiddleware.checkAuthToken,
  projectControllerPOST.create
);
//Rotas DELETE
projectRoutes.delete("/delete/:id", projectControllerPOST.deleteById);
export default projectRoutes;
