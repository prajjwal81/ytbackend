import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

export { cloudinary };

cloudinary.config({
  cloud_name: "dki451qlh",
  api_key: "488368953295229",
  api_secret: "<your_api_secret>", // Click 'View Credentials' below to copy your API secret
});
