import { Router } from "express";
import { login, logoutUser, registerUser } from "../controllers/userAuth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {userRegisterValidator,userLoginValidator} from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// unsecured route
router.route("/signup").post(userRegisterValidator(),validate , registerUser)
router.route("/login").post(userLoginValidator(),validate,login)

//secure routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/current-user").post(verifyJWT, getCurrentUser);
export default router;