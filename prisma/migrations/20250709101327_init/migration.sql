/*
  Warnings:

  - You are about to drop the `Hotel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotelDescription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Hotel`;

-- DropTable
DROP TABLE `HotelDescription`;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Hotels` (
    `hid` INTEGER NOT NULL,
    `id` VARCHAR(191) NULL,
    `hotel_name` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `lat` DECIMAL(65, 30) NULL,
    `lng` DECIMAL(65, 30) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `kind` VARCHAR(191) NULL,
    `check_in_time` VARCHAR(191) NULL,
    `check_out_time` VARCHAR(191) NULL,
    `country_code` VARCHAR(191) NULL,
    `star_rating` INTEGER NULL,
    `front_desk_time_start` VARCHAR(191) NULL,
    `front_desk_time_end` VARCHAR(191) NULL,
    `tripadvisor_id` INTEGER NULL,

    PRIMARY KEY (`hid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotelDescriptions` (
    `hid` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `paragraph` VARCHAR(191) NULL,
    `kind` VARCHAR(191) NULL,

    PRIMARY KEY (`hid`, `title`, `position`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Images` (
    `url` VARCHAR(191) NOT NULL,
    `image_type` VARCHAR(191) NULL,
    `hid` INTEGER NULL,
    `title` VARCHAR(191) NULL,
    `room_id` INTEGER NULL,

    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `uid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
