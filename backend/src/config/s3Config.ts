import * as dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

type UploadImageParams = {
  Key: string;
  Body: Buffer;
  ContentType: string;
};

type DownloadImageParams = {
  Key: string;
};

type DeleteImageParams = {
  Key: string;
};

export class S3DataSource {
  private static s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    apiVersion: "latest",
  });

  static bucketName = process.env.S3_BUCKET_NAME;

  static generateUniqueImageName = () => {
    const timestamp = new Date().getTime();
    const randomString = uuidv4().replace(/-/g, ""); // Generating a random string without dashes
    return `${timestamp}_${randomString}`;
  };

  static uploadImageToS3 = async (
    fileName: string,
    body: Buffer,
    contentType: string
  ) => {
    const params: UploadImageParams = {
      Key: fileName,
      Body: body,
      ContentType: contentType,
    };

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      ...params,
    });

    await this.s3.send(command);
  };

  static downloadFileFromS3 = async (fileKey: string) => {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    // Get the object from S3
    const response = await this.s3.send(command);

    return response;
  };

  static getImageUrlFromS3 = async (imageName: string) => {
    const params: DownloadImageParams = {
      Key: imageName,
    };
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      ...params,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return url;
  };

  static deleteImageFromS3 = async (imageName: string) => {
    const params: DeleteImageParams = {
      Key: imageName,
    };
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      ...params,
    });
    await this.s3.send(command);
  };
}
