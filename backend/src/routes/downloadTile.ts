import { Request, Response } from "express";
import { Readable } from "stream";
import { S3DataSource } from "../config/s3Config";

export const downloadTile = async (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  const directoryName = req.params.directoryName;
  const tileLevel = req.params.tileLevel;
  const tileName = req.params.tileName;
  const key = `tiles/${fileName}/${directoryName}/${tileLevel}/${tileName}`;

  console.log(key);
  try {
    const response = await S3DataSource.downloadFileFromS3(key);

    if (!response.Body) {
      res.status(404).send("File not found");
      return;
    }

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${key.split("/").pop()}"`
    );
    res.setHeader("Content-Type", "application/octet-stream"); // Or you can use the appropriate mime type

    // Pipe the S3 object stream to the client response
    const stream = response.Body as Readable;
    stream.pipe(res);

    stream.on("end", () => {
      console.log("File sent successfully.");
    });

    stream.on("error", (err) => {
      console.error("Error sending file:", err);
      res.status(500).send("Error sending file");
    });
  } catch (err) {
    console.error("Error fetching file from S3:", err);
    res.status(500).send("Error fetching file from S3");
  }
};
