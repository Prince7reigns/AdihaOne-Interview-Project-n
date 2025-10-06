import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Task} from "../models/task.model.js";

const createTask = asyncHandler(async(req,res)=>{
    const {title,description,periorty,completed,deadline} = req.body 

    if(
        [title,description,periorty,completed,deadline].some((feilds => feilds?.trim()===""))
    ){
        throw new ApiError(400,"all feilds are required")
    }

    const createdTask = await Task.create(
        {
          title,
          description,
          periorty,
          completed,
          deadline,
          owner:req.user._id
        }
    )

    if(!createdTask){
         throw new ApiError(500,"something went wrong while creating Task")
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200,createdTask,"task created successfully")
      )
})

export {
    createTask,
}