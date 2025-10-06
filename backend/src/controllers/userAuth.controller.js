import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const generateAccessAndRefereshTokens = async (userId) =>{
    try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken

    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async(req,res)=>{
    const {fullName,username,password,email} = req.body

    if(
        [fullName,email,password,username].some((feilds => feilds?.trim()===""))
    ){
        throw new ApiError(400,"all feilds are required")
    }

    const existedUser = await User.findOne(
        {
            $or:[{username},{email}]
        }
    )

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists",[])
    }

    const user = await User.create({
        fullName,
        username,
        password,
        email
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering User")
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
            200,
            {user:createdUser},
            "User Registered Successfully varication email has been sent on your email"
        )
      )

})

const login = asyncHandler(async(req,res)=>{

    const {username,email,password} = req.body

    if(!username || ! email){
        throw new ApiError(400,"Username or email is required")
    }

    const user = await User.findOne(
        {
            $or: [{email} , {username}]
        }
    )

    if(!user){
        throw new ApiError(400,"User does noy exsites")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invailid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id,
      );
    
      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken",
      );
    
      const options = {
        httpOnly: true,
        secure: true,
      };
    
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
            },
            "User logged in successfully",
          ),
        );
    });

export {
    registerUser,
    login,
    
}