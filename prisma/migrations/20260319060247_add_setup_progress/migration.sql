-- CreateTable
CREATE TABLE "SetupProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "embedActivated" BOOLEAN NOT NULL DEFAULT false,
    "barCreated" BOOLEAN NOT NULL DEFAULT false,
    "barConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SetupProgress_shop_key" ON "SetupProgress"("shop");
