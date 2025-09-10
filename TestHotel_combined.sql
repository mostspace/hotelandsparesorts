-- MySQL dump 10.13  Distrib 9.3.0, for macos15 (arm64)
--
-- Host: localhost    Database: hotelspa_mysql_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `Hotels`
--
-- WHERE:  hid = 8473727

LOCK TABLES `Hotels` WRITE;
/*!40000 ALTER TABLE `Hotels` DISABLE KEYS */;
INSERT IGNORE INTO `Hotels` VALUES (8473727,'test_hotel_do_not_book','Test Hotel (Do Not Book) test','Avenida Roble, Frente al Mall Multiplaza, Tegucigalpa',14.079872000000000000000000000000,-87.216770000000000000000000000000,'<test@horse.com>','+49243333333','Apartment','14:00:00','12:00:00','HN',4,'00:00:00','00:00:00',NULL,NULL,'24-hour reception,Elevator/lift,Early check-in,Late check-out,Cable TV,Locker,Concierge services,Dry-cleaning,Shoe shine,Breakfast,Common kitchen,Restaurant,Kitchen,Internet access,Car rental,Barbeque,Parking nearby,Spa tub,Conference Hall,Squash,Pets allowed (free)');
/*!40000 ALTER TABLE `Hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `HotelDescriptions`
--
-- WHERE:  hid = 8473727

LOCK TABLES `HotelDescriptions` WRITE;
/*!40000 ALTER TABLE `HotelDescriptions` DISABLE KEYS */;
INSERT IGNORE INTO `HotelDescriptions` VALUES (8473727,'At the apartment',0,'It’s time to have a nice meal! Stop by the restaurant. If you travel by car, there’s a paid parking zone at the apartment. You won’t be bored as at the apartment you will find a barbeque area. For participants of business meetings, there is a conference hall.','description'),(8473727,'At the apartment',1,'You won’t have to leave your pet at home as they are allowed for free. Accessible for guests with disabilities: the elevator helps them to go to the highest floors. There are other services available for the guests of the apartment. For example, dry cleaning, car rental and a concierge.','description'),(8473727,'Children and information about extra beds',0,'Fee for an extra bed: 100.00 ALL per night.','policy'),(8473727,'Children and information about extra beds',1,'The number of extra beds depends on the room category. You must take a look at the information about the size of the selected room.','policy'),(8473727,'Children and information about extra beds',2,'Breakfast for children aged 0-5 costs: 200.00 USD.','policy'),(8473727,'Children and information about extra beds',3,'Breakfast for children aged 6-12 costs: 400.00 USD.','policy'),(8473727,'Children and information about extra beds',4,'Children from the age of 0 to 3 can stay in additional beds (child bed/cot) for a charge of 500.00 CHF a night providing they share a room with their parents or guardians. Additional beds (child bed/cot) available on request.','policy'),(8473727,'Children and information about extra beds',5,'Children from the age of 4 to 9 can stay in additional beds (child bed/cot) for a charge of 700.00 ALL a night providing they share a room with their parents or guardians. Additional beds (child bed/cot) available on request.','policy'),(8473727,'Children and information about extra beds',6,'Children from the age of 10 to 12 can stay free of charge providing they share a room with their parents or guardians, in the existing beds.','policy'),(8473727,'Extra info',0,'The given hotel is a fiction and should not be booked. If you book this hotel the further accommodation shall not be provided.','policy'),(8473727,'Location',0,'A perfect fit for a big group of travellers: apartment «Test Hotel (Do Not Book) test» is located in Tegucigalpa. This apartment is located in 3 km from the city center.','description'),(8473727,'Meals',0,'Price of an additional breakfast: 300.00 USD per person. Information about the type of meals included in the price is indicated in the rate details.','policy'),(8473727,'Metapolicy Extra Info',0,'Front desk is open 24/7.\nThe given hotel is a fiction and should not be booked. If you book this hotel the further accommodation shall not be provided.','metapolicy'),(8473727,'Parking space',0,'Chargeable parking available. Cost: 100.00 USD per day.','policy'),(8473727,'Special living conditions',0,'A deposit of 123.00 HNL per stay will be required at check-in to cover any potential damages.','policy'),(8473727,'Special living conditions',1,'Keys deposit is required. Cost: 10.00 BAM per room per stay.','policy'),(8473727,'Special living conditions',2,'You can request the documents necessary for a visa, the service is provided for an additional fee. Any additional fee will have to be paid even if the booking is subsequently cancelled, and all the agreements exist exclusively between you and the provider of the documents.','policy'),(8473727,'Special living conditions',3,'Attention! If you do not check in to your room before 9:00 PM at night, the booking will be cancelled.','policy'),(8473727,'Transfer',0,'Transfer from/to railway station available. Cost: 100.00 EUR one way.','policy'),(8473727,'Transfer',1,'Transfer from/to airport available. Cost: 200.00 EUR one way.','policy');
/*!40000 ALTER TABLE `HotelDescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Images`
--
-- WHERE:  hid = 8473727

LOCK TABLES `Images` WRITE;
/*!40000 ALTER TABLE `Images` DISABLE KEYS */;
INSERT IGNORE INTO `Images` VALUES ('https://cdn.worldota.net/t/{size}/extranet/0f/96/0f96b1ba4bf5ee5595aa38581325650c706ad31f.jpeg','room',8473727,'Apartment with balcony',18395671),('https://cdn.worldota.net/t/{size}/extranet/11/80/118098dc06238834a9becb33546314a61fc50ff7.jpeg','general',8473727,'outside',NULL),('https://cdn.worldota.net/t/{size}/extranet/13/11/13115f9ec6d13ae5a3e9b5afdb693e7f22cfcfe0.jpeg','general',8473727,'outside',NULL),('https://cdn.worldota.net/t/{size}/extranet/15/44/15440558c952ec4c3488730d1563dc9e8d25832c.JPEG','general',8473727,'outside',NULL),('https://cdn.worldota.net/t/{size}/extranet/3a/10/3a10a5fb8f969ffcb049c1ab581aa6ed3bb6a41b.JPEG','room',8473727,'Deluxe Double room',130),('https://cdn.worldota.net/t/{size}/extranet/3a/be/3abe524b9b7216557776102b00ec1c3757daf72f.jpeg','room',8473727,'Standard Double room',95),('https://cdn.worldota.net/t/{size}/extranet/3d/4d/3d4dbaa5a5406f23b014d8e9db79de1d90ae1f72.JPEG','room',8473727,'Deluxe Double room',130),('https://cdn.worldota.net/t/{size}/extranet/48/2c/482c8098b5b2f29c84fcf5a2b941e5255ceb5e24.jpeg','room',8473727,'Standard Double room',95),('https://cdn.worldota.net/t/{size}/extranet/4d/b5/4db591d6c861e226aa83b8e38ccd4f57c5364e34.JPEG','room',8473727,'Standard Double room',95),('https://cdn.worldota.net/t/{size}/extranet/55/0f/550f03096f8bf9f458bc8662f2dc4d870ba8f853.jpeg','general',8473727,'others',NULL),('https://cdn.worldota.net/t/{size}/extranet/5d/e4/5de47f04eb2a04880b619fac52a5d9d7296cee74.jpeg','room',8473727,'Deluxe room',28),('https://cdn.worldota.net/t/{size}/extranet/6e/5b/6e5b761eaa9e07abfd997ec02d84fa7cf2229fa7.jpeg','general',8473727,'others',NULL),('https://cdn.worldota.net/t/{size}/extranet/78/2e/782e73450732741bc26d2161eb82235add21532e.png','room',8473727,'Suite',32),('https://cdn.worldota.net/t/{size}/extranet/b5/d3/b5d3d33394494c68321246882c1bd93a6832dcd5.jpeg','general',8473727,'others',NULL),('https://cdn.worldota.net/t/{size}/extranet/c2/6a/c26ad3e0e12fe393d6f545851ed33c0d643ead28.jpeg','room',8473727,'6 Bedrooms Villa',18395673),('https://cdn.worldota.net/t/{size}/extranet/cb/5c/cb5c32fcbecc04846c2d21e2d7bfe53eaa3f97a8.JPEG','room',8473727,'Deluxe Double room',130),('https://cdn.worldota.net/t/{size}/extranet/cf/cd/cfcd60bc8fc0cab8fa26c3c63617d541cf1175ee.jpeg','general',8473727,'others',NULL),('https://cdn.worldota.net/t/{size}/extranet/d8/ef/d8efcb8e230c6d53a95da50dc4167c1350b2db39.JPEG','room',8473727,'Standard Double room',95),('https://cdn.worldota.net/t/{size}/extranet/e8/f4/e8f40eaf38b682c54a53335e07a4328785955f14.JPEG','room',8473727,'Standard Double room',95),('https://cdn.worldota.net/t/{size}/extranet/f7/c6/f7c6dff491c8e197d5dd9dcc2e8245592384df9f.jpeg','room',8473727,'Standard Double room',95),('https://cdn.worldota.net/t/{size}/extranet/zz/15/ad151c157315d9bd36a9c67bdfdb9784c293b7e9.jpeg','room',8473727,'Deluxe room',28);
/*!40000 ALTER TABLE `Images` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-10 19:49:56
