import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowecase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowecase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowecase: true,
    },

    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

// for Hashing the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  jwt.sign({
    id: this.id,
    email: this.email,
    name: this.name,
    userName: this.userName,
  }),
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    };
};

userSchema.methods.generateRefreshToken = function () {
  jwt.sign({
    id: this.id,
    email: this.email,
    name: this.name,
    userName: this.userName, 
  }),
    process.env.REFRESH_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    };
};

export const User = mongoose.model("User", userSchema);
