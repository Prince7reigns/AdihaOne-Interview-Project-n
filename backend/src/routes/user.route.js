import { Router } from "express";
import { login, logoutUser, registerUser,changeCurrentPassword , updateUserDetails,getCurrentUser} from "../controllers/userAuth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {userRegisterValidator,userLoginValidator,userChangeCurrentPasswordValidator} from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// unsecured route
router.route("/signup").post(userRegisterValidator(),validate , registerUser)
router.route("/login").post(userLoginValidator(),validate,login)

//secure routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .put(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );
  router.route("/update-user").put(
    verifyJWT,
    userLoginValidator(),
    validate,
    updateUserDetails,
  )
export default router;