/*
  Warnings:

  - You are about to drop the column `password_salt` on the `user_auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_auth` DROP COLUMN `password_salt`;
