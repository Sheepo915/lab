/*
  Warnings:

  - You are about to drop the column `userAuthUserId` on the `refresh_tokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_userAuthUserId_fkey`;

-- AlterTable
ALTER TABLE `refresh_tokens` DROP COLUMN `userAuthUserId`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user_auth`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
