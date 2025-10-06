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

const updateTask = asyncHandler(async(req,res)=>{
    const {title,description,periorty,dueDate} = req.body
    const taskId = req.params.id;

    if(!isValidObjectId(taskId)){
        throw new ApiError(400,"Invalid task id")
    }

    const task = await Task.findById(taskId)
    
    if(!task){
        throw new ApiError(404,"Task not found")
    }

    if (task.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit the task");
    }

    const update = {}
    if(title){
        update.title = title
    }

    if(description){
        update.description = description
    }

    if(periorty){
        update.periorty=periorty
    }

    if(dueDate){
        update.dueDate = dueDate
    }

    const updatedTask = await Task.findByIdAndUpdate(
        task._id,
        {
            $set:update
        },
        {
            new:true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,updatedTask,"Task updated successfully"))
})


const deleteTask = asyncHandler(async(req,res)=>{
    const taskId = req.params.id;

    if(!isValidObjectId(taskId)){
        throw new ApiError(400,"Invalid task id")
    }

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404,"Task not found")
    }

    if (task.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit the task");
    }

    await Task.findByIdAndDelete(task._id)

    return res
    .status(200)
    .json(new ApiResponse(200,{} , "Task deleted successfully"))

})

const getTeskById = asyncHandler(async(req,res)=>{
    const taskId = req.params.id;

    if(!isValidObjectId(taskId)){
        throw new ApiError(400,"Invalid task id")
    }

    const task = await Task.findOne({
        _id:taskId,
        owner:req.user?._id
    })

    if(!task){
        throw new ApiError(404,"Task not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,task,"Task retrieved successfully"))
})

const getTasks = asyncHandler(async(req,res)=>{
    const tasks = await Task.find({owner:req.user?._id}).sort({ createdAt: -1 })

    if(!tasks){
        throw new ApiError(404,"No tasks found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,tasks,"Tasks retrieved successfully"))
})

export {
    createTask,
    updateTask,
    deleteTask,
    getTeskById,
    getTasks
}