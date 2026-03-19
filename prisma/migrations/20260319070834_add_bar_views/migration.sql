-- CreateTable
CREATE TABLE "BarView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "viewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "BarView_shop_idx" ON "BarView"("shop");

-- CreateIndex
CREATE INDEX "BarView_announcementId_idx" ON "BarView"("announcementId");

-- CreateIndex
CREATE INDEX "BarView_shop_viewedAt_idx" ON "BarView"("shop", "viewedAt");
