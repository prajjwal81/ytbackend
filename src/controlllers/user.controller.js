import AsyncHandler from "../utils/asyncHandler.js";

const registerUser = AsyncHandler(async (req, res) => {
  res.status(400).json({ message: "ok" });
});

export { registerUser };
