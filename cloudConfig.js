const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

console.log(
  "Cloud Name:",
  process.env.CLOUD_CLOUD_NAME ? "Loaded" : "MISSING!"
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_dev",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

module.exports = { cloudinary, storage };
