/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `user_auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_auth` DROP COLUMN `refresh_token`;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `refresh_token` VARCHAR(191) NOT NULL,
    `userAuthUserId` INTEGER NULL,

    UNIQUE INDEX `refresh_tokens_refresh_token_key`(`refresh_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userAuthUserId_fkey` FOREIGN KEY (`userAuthUserId`) REFERENCES `user_auth`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
