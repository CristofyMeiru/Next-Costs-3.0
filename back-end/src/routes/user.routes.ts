import { Router } from "express";
import { userControllerGET, userControllerPOST } from "../controllers/UserController";
import tokenMiddleware from "../middlewares/TokenMiddleware";

const userRoutes = Router();

//Rotas GET
userRoutes.get("/username/:username", userControllerGET.getByUsername)
userRoutes.get("/get_user_data", tokenMiddleware.checkAuthToken, userControllerGET.userData)
//Rotas POST
userRoutes.post("/register", userControllerPOST.registerUser);
userRoutes.post('/auth', userControllerPOST.auth)
userRoutes.post('/refresh_auth', userControllerPOST.refreshAuth)


export default userRoutes; 
