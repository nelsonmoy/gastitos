-- MySQL dump 10.13  Distrib 5.1.57, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: a1972699_gastito
-- ------------------------------------------------------
-- Server version	5.1.57
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `records`
--

DROP TABLE IF EXISTS `records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `concept` varchar(100) NOT NULL,
  `cost` float NOT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `records`
--

LOCK TABLES `records` WRITE;
/*!40000 ALTER TABLE `records` DISABLE KEYS */;
INSERT INTO `records` VALUES (1,1,'pasaje',12,'2014-06-16 07:26:10'),(2,1,'galleta',9,'2014-06-16 07:26:18'),(5,1,'Gasolina',245,'2014-06-22 07:54:25'),(6,1,'Cena',100,'2014-06-22 07:54:55'),(8,1,'Desayuno',50,'2014-06-22 08:48:33'),(10,1,'Zapatos',500,'2014-06-22 08:49:30'),(11,1,'Cigarros',10,'2014-06-22 08:49:44'),(12,1,'Ropa',1245,'2014-06-22 08:51:22'),(13,1,'Saldo',200,'2014-06-22 08:52:13'),(14,1,'Cine',50,'2014-06-27 20:08:35'),(15,1,'sabritas',20,'2014-07-21 22:08:30'),(16,1,'cafe',15,'2014-07-21 22:08:40'),(17,1,'cigarros',3.5,'2014-07-21 22:08:51'),(18,2,'testing',10,'2014-10-25 14:00:51'),(21,2,'food',222,'2014-10-25 14:06:23'),(22,2,'test',8.5,'2014-10-27 12:49:40'),(23,2,'osman',12.22,'2014-10-27 18:09:15'),(25,2,'food',10,'2014-11-03 17:41:58'),(26,2,'osman',12.34,'2014-11-08 12:58:24'),(27,2,'tromo',8.5,'2014-12-21 22:57:19');
/*!40000 ALTER TABLE `records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password` text NOT NULL,
  `hash` text NOT NULL,
  `status` int(11) DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nelsonmanuel@outlook.com','7815696ecbf1c96e6894b779456d330e','3c0912b79c933cf03618de66a8b65706',1,'2014-06-16 07:21:04',NULL),(2,'hola','4d186321c1a7f0f354b297e8914ab240','f688ae26e9cfa3ba6235477831d5122e',1,'2014-08-21 00:00:00',NULL),(3,'1\\\' OR \\\'1\\\' = \\\'1','e326de05a5c10f46ea55b04864b43571','5b229e13882b689496a8dad6c3e0ea91',0,'2014-11-21 06:37:47',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-03-08 10:54:51
