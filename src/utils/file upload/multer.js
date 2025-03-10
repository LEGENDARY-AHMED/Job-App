import multer, { diskStorage } from "multer";

export const fileUpload = (allowedTypes) => {
  try {
    const storage = diskStorage({});
    const fileFilter = (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype))
        return cb(new Error("Invalid file type"), false);

      cb(null, true);
    };
    return multer({ storage, fileFilter });
  } catch (err) {
    console.error(err.message);
  }
};
