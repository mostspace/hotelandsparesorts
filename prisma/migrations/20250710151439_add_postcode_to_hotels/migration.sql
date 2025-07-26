-- AddForeignKey
ALTER TABLE `HotelDescriptions` ADD CONSTRAINT `HotelDescriptions_hid_fkey` FOREIGN KEY (`hid`) REFERENCES `Hotels`(`hid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Images` ADD CONSTRAINT `Images_hid_fkey` FOREIGN KEY (`hid`) REFERENCES `Hotels`(`hid`) ON DELETE SET NULL ON UPDATE CASCADE;
