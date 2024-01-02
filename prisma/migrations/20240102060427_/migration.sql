/*
  Warnings:

  - A unique constraint covering the columns `[jwt_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `jwt_token` CHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_jwt_token_key` ON `User`(`jwt_token`);
