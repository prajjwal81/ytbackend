import AsyncHandler from "../utils/asyncHandler.js";

const registerUser = AsyncHandler(async (req, res) => {
  const { name, fullname, email, avatar, caoverImage, password } = req.body;

  if (
    [name, fullname, email, avatar, caoverImage, password].some(
      (field) => field.trim() === " "
    )
  ) {
  }
});

export { registerUser };
