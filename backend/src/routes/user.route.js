import { Router } from "express";
import { login, registerUser } from "../controllers/userAuth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {userRegisterValidator,userLoginValidator} from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/signup").post(userRegisterValidator(),validate , registerUser)
router.route("/login").post(userLoginValidator(),validate,login)

export default router ;