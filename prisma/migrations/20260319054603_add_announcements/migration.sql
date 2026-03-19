-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'topbar',
    "placement" TEXT NOT NULL DEFAULT 'all_pages',
    "position" TEXT NOT NULL DEFAULT 'top',
    "status" TEXT NOT NULL DEFAULT 'published',
    "settings" TEXT NOT NULL DEFAULT '{}',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Announcement_shop_idx" ON "Announcement"("shop");
