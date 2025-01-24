import { Router } from "express";
import { userControllerGET, userControllerPOST } from "../controllers/UserController";
import tokenMiddleware from "../middlewares/TokenMiddleware";
import upload from "../middlewares/MulterMiddleware";

const userRoutes = Router();

//Rotas GET
userRoutes.get("/username/:username", userControllerGET.getByUsername)
userRoutes.get("/get_user_data", tokenMiddleware.checkAuthToken, userControllerGET.userData)
//Rotas POST
userRoutes.post("/register", userControllerPOST.registerUser);
userRoutes.post('/auth', userControllerPOST.auth)
userRoutes.post('/refresh_auth', userControllerPOST.refreshAuth)
userRoutes.post('/set_profile_image', tokenMiddleware.checkAuthToken, upload.single('profile_image'), userControllerPOST.addProfileImage)

export default userRoutes; 
 