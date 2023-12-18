import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRAT,
});

const uploadOnCloudinary = async (localFile) => {
  try {
    if (!localFile) return null;
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFile);
    return response;
  } catch (error) {
    fs.unlinkSync(localFile);
    console.log("file is not uploaded ", error);
    return null;
  }
};

export { uploadOnCloudinary };
