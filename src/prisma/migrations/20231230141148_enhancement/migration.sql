/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `username_UNIQUE` ON `user_account`(`username`);
