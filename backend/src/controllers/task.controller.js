import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Task} from "../models/task.model.js";
import {isValidObjectId} from "mongoose";


const createTask = asyncHandler(async(req,res)=>{
    const {title,description,priority,dueDate} = req.body 

    if(
        [title,description,priority].some((feilds => feilds?.trim()===""))
    ){
        throw new ApiError(400,"all feilds are required")
    }

    const createdTask = await Task.create(
        {
          title,
          description,
          priority,
          dueDate:dueDate,
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
    const {title,description,priority,dueDate} = req.body
    const taskId = req.params;
   
    if(!isValidObjectId(taskId)){
        throw new ApiError(400,`Invalid task id`)
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

    if(priority){
        update.periorty=priority
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

const taskToggleComplete = asyncHandler(async(req,res)=>{

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

    if (task.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit the task");
    }

    const toggleTask = await Task.findByIdAndUpdate(
        task._id,
        {
            $set:{
                completed:!task?.completed
            }
        }
    )

    if(!toggleTask){
        throw new ApiError(500,"something went wrong")
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200,toggleTask,"task Toggle Completed")
      )
})

export {
    createTask,
    updateTask,
    deleteTask,
    getTeskById,
    getTasks,
    taskToggleComplete
}