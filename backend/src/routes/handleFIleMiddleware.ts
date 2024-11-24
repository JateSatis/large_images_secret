import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = [
    "image/tif",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.originalname}. Only PNG, JPG, and JPEG are allowed.`
      )
    );
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 1,
    fileSize: 10 * 1024 * 1024 * 1024,
  },
});

const handleFileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json(error);
    }

    next();
    return;
  });
};

export { handleFileMiddleware as handleFile };
