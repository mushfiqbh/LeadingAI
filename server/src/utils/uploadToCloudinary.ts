import streamifier from "streamifier";
import cloudinary from "./cloudinary";

export const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image", // optional, defaults to image
        use_filename: true,     // optional, keeps original file name
        unique_filename: true,  // optional, avoids overwrites
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("No secure_url returned from Cloudinary"));
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
