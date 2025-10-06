import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
     createTask,
    updateTask,
    deleteTask,
    getTeskById,
    getTasks,
    taskToggleComplete
} from "../controllers/task.controller.js"
import {taskCreateValidator} from "../validators/index.js"



const router = Router()

router.route('/gp')
    .get(verifyJWT,getTasks)
    .post(taskCreateValidator(),validate, verifyJWT,createTask)

router.route('/:id/gp')
    .get(verifyJWT,getTeskById)
    .put(verifyJWT,updateTask)
    .delete(verifyJWT,deleteTask)
    .post(verifyJWT,taskToggleComplete)


export default router;