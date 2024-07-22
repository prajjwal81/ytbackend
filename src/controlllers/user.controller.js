import AsyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = AsyncHandler(async (req, res) => {
  const { name, fullname, email, avatar, coverImage, password } = req.body;

  if (
    [name, fullname, email, avatar, coverImage, password].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please add the required field");
  }

  const existingUser = await User.findOne({ name });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  } 

  const avatarLocalPath = req?.files?.avatar[0].path;
  const coverImageLocalPath = req?.files?.coverImage[0].path;

  const uploadAvatar = uploadOnCloudinary(avatarLocalPath);
  const uploadCoverImage = uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please add the required field");
  }

  const createUser = await new User.create({
    name,
    fullname,
    email,
    avatar,
    caoverImage,
    password,
  });
});

export { registerUser };
