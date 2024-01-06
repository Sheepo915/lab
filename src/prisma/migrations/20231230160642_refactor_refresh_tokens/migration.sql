/*
  Warnings:

  - A unique constraint covering the columns `[refreshTokenId]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshTokenId` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `refresh_tokens` ADD COLUMN `refreshTokenId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`refreshTokenId`);

-- CreateIndex
CREATE UNIQUE INDEX `refresh_tokens_refreshTokenId_key` ON `refresh_tokens`(`refreshTokenId`);
