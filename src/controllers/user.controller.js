import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // return res.status(200).json({
  //   message: "ok",
  // });
  const {fullname, email, username, password} = req.body
  console.log("email: ", email)

  if([fullname,email,username,password].some((field)=> field?.trim() === "")){
    throw new ApiErrors(400, "All fields are required")
  }

  const existingUser = await User.findOne({
    $or: [{username}, {email}]
  })

  if(existingUser){
    throw new ApiErrors(409, "User already exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
   {coverImageLocalPath = req.files?.coverImage[0]?.path;}

  if(!avatarLocalPath){
    throw new ApiErrors(400, "avatar is mendatory")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiErrors(400, "avatar is mendatory")
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiErrors(500, "Something went wrong while registering the user")

  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
  )
});

export { registerUser };
