-- AlterTable
ALTER TABLE `Bookings` ADD COLUMN `uid` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `Users`(`uid`) ON DELETE SET NULL ON UPDATE CASCADE;
