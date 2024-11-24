const tus = require("tus-js-client");
const fs = require("fs");

const sendImageWithTus = (filePath, serverUrl) => {
  const fileStream = fs.createReadStream(filePath);
  const stats = fs.statSync(filePath);

  const startTime = Date.now();

  const upload = new tus.Upload(fileStream, {
    endpoint: serverUrl,
    // chunkSize: Math.ceil(stats.size),
    retryDelays: [0, 1000, 3000, 5000],
    metadata: {
      filename: filePath.split("/").pop(),
      filetype: "image/png",
      parentPath: "root",
    },
    uploadSize: stats.size,
    onError: (error) => {
      console.error("Upload failed:", error.message);
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      console.log(`Uploaded ${percentage}%`);
    },
    onSuccess: () => {
      console.log("Upload finished successfully.");
      console.log(`Upload time: ${Date.now() - startTime}`);
    },
  });

  upload.start();
};

const filePath = "./image_1_level_1.png";
const serverUrl = "http://localhost:3000/images/upload-image";
sendImageWithTus(filePath, serverUrl);
