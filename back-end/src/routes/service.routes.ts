import { Router } from "express";
import { serviceControllerGET, serviceControllerPOST } from "../controllers/ServiceController";
import tokenMiddleware from "../middlewares/TokenMiddleware";

const serviceRoutes = Router()

//Rotas GET
serviceRoutes.get("/get_by_project/:projectId", tokenMiddleware.checkAuthToken, serviceControllerGET.getServicesByProjectId)
//Rotas POST
serviceRoutes.post("/create_service", tokenMiddleware.checkAuthToken, serviceControllerPOST.createService)
//Rotas UPDATE / PUT

export default serviceRoutes