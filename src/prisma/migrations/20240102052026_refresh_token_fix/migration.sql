-- DropIndex
DROP INDEX `refresh_tokens_refresh_token_key` ON `refresh_tokens`;

-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `refresh_token` TEXT NOT NULL;
