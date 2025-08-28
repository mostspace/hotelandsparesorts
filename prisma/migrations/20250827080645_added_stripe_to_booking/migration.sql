-- AlterTable
ALTER TABLE `Bookings` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `stripe_id` VARCHAR(191) NULL;
