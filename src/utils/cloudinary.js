import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (locakFilePath) => {
  try {
    if (!locakFilePath) return null;
    // upload file on Cloudinary
    const fileUpload = await cloudinary.uploader.upload(locakFilePath, {
      resource_type: "auto",
    });
    console.log("file is uploaded");
    return fileUpload;
  } catch (error) {
    // it remove the file from your server
    fs.unlinkSync(locakFilePath);
    console.log(error);
  }
};

export { uploadOnCloudinary };
