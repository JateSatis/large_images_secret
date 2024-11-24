-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "dziKey" TEXT NOT NULL,
    "viewportX" DOUBLE PRECISION,
    "viewportY" DOUBLE PRECISION,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comment_text_key" ON "Comment"("text");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_dziKey_key" ON "Comment"("dziKey");
