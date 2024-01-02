-- DropIndex
DROP INDEX `User_jwt_token_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `jwt_token` TEXT NULL;
