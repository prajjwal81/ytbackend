import AsyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = (user_id) => {
  try {
    const user = User.findById(user_id);

    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.RefreshToken = RefreshToken;
    user.save();
    return { AccessToken, RefreshToken };
  } catch (error) {
    console.error();
    throw new ApiError(500, "Something Went wrong");
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (
    [userName, fullName, email, password].some((field) => field.trim() === " ")
  ) {
    throw new ApiError(400, "Please add the required field");
  }

  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const avatarLocalPath = req?.files?.avatar[0].path;
  const coverImageLocalPath = req?.files?.coverImage[0].path;

  const uploadAvatar = await uploadOnCloudinary(avatarLocalPath);
  const uploadCoverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!uploadAvatar) {
    throw new ApiError(400, "Please add the required field");
  }

  const createUser = await User.create({
    userName,
    fullName,
    email,
    avatar: uploadAvatar.url,
    coverImage: uploadCoverImage.url || "",
    password,
  });

  return res.status(201).json(new ApiResponse(200, createUser, "user Created"));
});

const userLogin = AsyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email) {
    throw new ApiError(400, "Please provide credentials");
  }

  const user = User.findOne({ $or: [{ userName }, { email }] });

  if (!user) {
    throw new ApiError(400, "User not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Password is not valid");
  }
  const { AccessToken, RefreshToken } = generateAccessAndRefreshToken(user._id);
  const loginUser = await User.select("-RefreshToken -password");

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("AccessToken", AccessToken, option)
    .cookie("RefreshToken", RefreshToken, option)
    .json(new ApiResponse(200, loginUser, "Login Success"));
});

export { registerUser, userLogin };
