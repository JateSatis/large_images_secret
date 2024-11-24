import { Request, Response, Router } from "express";
import path from "path";
import { Server, Upload } from "@tus/server";
import { FileStore } from "@tus/file-store";
import * as dotenv from "dotenv";
import { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import { divideImageToTiles } from "./divideImageToTiles";
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
import { handleFile } from "./handleFIleMiddleware";
import { prisma } from "../config/postgresConfig";

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

    const parentPath = metadata!!.parentPath!!;
    const imageName = metadata!!.filename!!;

    const filePath = upload.storage?.path!!;
    const imageBuffer = fs.readFileSync(filePath);

    const exisitingImage = await prisma.image.findFirst({
      where: {
        path: `${parentPath}/${imageName}`,
      },
    });

    if (exisitingImage) {
      return res;
    }

    const folder = await prisma.folder.findFirst({
      where: {
        path: parentPath,
      },
    });

    if (!folder) {
      return res;
    }

    const dziKey = await divideImageToTiles(imageBuffer, imageName);

    let createdImage;
    try {
      createdImage = await prisma.image.create({
        data: {
          dziKey: dziKey,
          name: imageName,
          folderId: folder?.id,
          path: `${parentPath}/${imageName}`,
        },
      });
    } catch (error) {
      return res;
    }

    console.log(JSON.stringify(createdImage));

    return res;
  },
});

// Route all Tus-related requests (POST, PATCH, HEAD, etc.) to the Tus server
imageRouter.post("/upload-image", async (req: Request, res: Response) => {
  tusServer.handle.bind(tusServer)(req, res);
});

imageRouter.all("/upload-image/*", tusServer.handle.bind(tusServer));

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
