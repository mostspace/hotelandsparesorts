-- CreateTable
CREATE TABLE `Rooms` (
    `room_id` INTEGER NOT NULL,
    `hid` INTEGER NOT NULL,
    `rg_ext` JSON NULL,
    `amenities` TEXT NULL,

    PRIMARY KEY (`room_id`, `hid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rooms` ADD CONSTRAINT `Rooms_hid_fkey` FOREIGN KEY (`hid`) REFERENCES `Hotels`(`hid`) ON DELETE RESTRICT ON UPDATE CASCADE;
