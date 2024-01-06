-- CreateTable
CREATE TABLE `email_validation_status` (
    `email_validation_status_id` INTEGER NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'FALSE',

    UNIQUE INDEX `email_validation_status_id_UNIQUE`(`email_validation_status_id`),
    PRIMARY KEY (`email_validation_status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_account` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `gender` CHAR(1) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `profile_pic` LONGTEXT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_auth` (
    `user_id` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `password_salt` VARCHAR(100) NOT NULL,
    `email_validation_status_id` INTEGER NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    INDEX `email_validation_status_id_idx`(`email_validation_status_id`),
    INDEX `email_validation_status_idx`(`email_validation_status_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_account` ADD CONSTRAINT `user_auth` FOREIGN KEY (`user_id`) REFERENCES `user_auth`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_auth` ADD CONSTRAINT `email_validation_status_id` FOREIGN KEY (`email_validation_status_id`) REFERENCES `email_validation_status`(`email_validation_status_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_auth` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user_account`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
