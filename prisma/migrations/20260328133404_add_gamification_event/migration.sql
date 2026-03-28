-- CreateTable
CREATE TABLE "GamificationEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userHash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pointsAwarded" INTEGER NOT NULL,
    "referenceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "GamificationEvent_userHash_idx" ON "GamificationEvent"("userHash");

-- CreateIndex
CREATE INDEX "GamificationEvent_userHash_type_referenceId_idx" ON "GamificationEvent"("userHash", "type", "referenceId");
