/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "dziKey" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screenshot" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "dziKey" TEXT NOT NULL,
    "viewportX" DOUBLE PRECISION,
    "viewportY" DOUBLE PRECISION,
    "viewportZoom" DOUBLE PRECISION,

    CONSTRAINT "Screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_originalName_key" ON "Image"("originalName");

-- CreateIndex
CREATE UNIQUE INDEX "Image_dziKey_key" ON "Image"("dziKey");

-- CreateIndex
CREATE UNIQUE INDEX "Screenshot_originalName_key" ON "Screenshot"("originalName");

-- CreateIndex
CREATE UNIQUE INDEX "Screenshot_dziKey_key" ON "Screenshot"("dziKey");
