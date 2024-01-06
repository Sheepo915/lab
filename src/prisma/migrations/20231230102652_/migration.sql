-- DropForeignKey
ALTER TABLE `user_account` DROP FOREIGN KEY `user_auth`;

-- DropForeignKey
ALTER TABLE `user_auth` DROP FOREIGN KEY `user_id`;

-- AddForeignKey
ALTER TABLE `user_auth` ADD CONSTRAINT `user_account` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
