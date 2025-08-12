-- CreateTable
CREATE TABLE `Bookings` (
    `order_id` INTEGER NOT NULL,
    `partner_id` VARCHAR(191) NOT NULL,
    `hid` INTEGER NOT NULL,
    `check_in` DATETIME(3) NOT NULL,
    `check_out` DATETIME(3) NOT NULL,
    `adults` INTEGER NOT NULL,
    `children` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency_code` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `room_name` VARCHAR(191) NOT NULL,
    `amenities` TEXT NULL,
    `voucher_used` VARCHAR(191) NULL,
    `amount_paid` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_hid_fkey` FOREIGN KEY (`hid`) REFERENCES `Hotels`(`hid`) ON DELETE RESTRICT ON UPDATE CASCADE;
