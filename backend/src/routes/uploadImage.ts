import { Router } from "express";
import path from "path";
import { Server, Upload } from "@tus/server";
import { FileStore } from "@tus/file-store";
import * as dotenv from "dotenv";
import { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import { S3DataSource } from "../config/s3Config";
import { processImage } from "./processImage";
import { downloadDzi } from "./downloadDzi";
import { downloadTile } from "./downloadTile";
import { getImagesInfo } from "./getImagesInfo";
import { createFolder } from "./fileSystem/createFolder";
import { getFolder } from "./fileSystem/getFolder";
import { getFileStructure } from "./fileSystem/getFileStructure";
import { createScreenshot } from "./fileSystem/createScreenshot";
import { getScreenshots } from "./fileSystem/getScreenshots";
import { createComment } from "./fileSystem/createComment";
import { getComments } from "./fileSystem/getComments";

dotenv.config();

export const imageRouter = Router();

// Create a new Tus server
const tusServer = new Server({
  path: "/images/upload-image", // This is the base path for Tus requests
  datastore: new FileStore({
    directory: path.join(__dirname, "../uploads"), // Directory to store uploaded files
  }),
  onUploadFinish: async (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    upload: Upload
  ): Promise<ServerResponse<IncomingMessage>> => {
    const metadata = upload.metadata;

    const imageName = metadata!!.filename!!;
    const filetype = metadata!!.filetype!!;

    const filePath = upload.storage?.path!!;
    const imageBuffer = fs.readFileSync(filePath);

    S3DataSource.uploadImageToS3(imageName, imageBuffer, filetype);

    return res;
  },
});

// Route all Tus-related requests (POST, PATCH, HEAD, etc.) to the Tus server
imageRouter.post("/upload-image", tusServer.handle.bind(tusServer));

imageRouter.all("/upload-image/*", tusServer.handle.bind(tusServer));

imageRouter.get("/process-image", processImage);

imageRouter.get("/download-file/tiles/:fileName/:dziFileName", downloadDzi);

imageRouter.get(
  "/download-file/tiles/:fileName/:directoryName/:tileLevel/:tileName",
  downloadTile
);

imageRouter.get("/getImagesInfo", getImagesInfo);

imageRouter.post("/create-folder", createFolder);

imageRouter.get("/get-folder", getFolder);

imageRouter.get("/get-file-structure", getFileStructure);

imageRouter.post("/create-screenshot", createScreenshot);

imageRouter.get("/get-screenshots", getScreenshots);

imageRouter.post("/create-comment", createComment);

imageRouter.post("/get-comments", getComments);