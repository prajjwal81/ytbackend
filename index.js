import "dotenv/config";
import mongoose from "mongoose";
import { DB_NAME } from "./src/utils/constant.js";
import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.listen(process.env.PORT, () => {
      console.log(`app is listening on the port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
})();

app.use(
  cors({
    origin: process.env.PORT,
    Credential: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import UserRouter from "./src/routes/user.routes.js";

// router declaration
app.use("/api/v1/user", UserRouter);
