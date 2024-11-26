-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               11.6.2-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Exportiere Datenbank-Struktur für discord
CREATE DATABASE IF NOT EXISTS `discord` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `discord`;

-- Exportiere Struktur von Tabelle discord.bad_words
CREATE TABLE IF NOT EXISTS `bad_words` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.bump_roles
CREATE TABLE IF NOT EXISTS `bump_roles` (
  `guild_id` varchar(255) NOT NULL,
  `role_id` varchar(255) NOT NULL,
  `channel_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.bump_settings
CREATE TABLE IF NOT EXISTS `bump_settings` (
  `guild_id` varchar(20) NOT NULL,
  `role_id` varchar(20) NOT NULL,
  `channel_id` varchar(20) NOT NULL,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.config
CREATE TABLE IF NOT EXISTS `config` (
  `guild_id` varchar(20) NOT NULL,
  `log_channel_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.feedback_settings
CREATE TABLE IF NOT EXISTS `feedback_settings` (
  `guild_id` varchar(20) NOT NULL,
  `feedback_channel_id` varchar(20) NOT NULL,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.levels
CREATE TABLE IF NOT EXISTS `levels` (
  `user_id` varchar(255) NOT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `level` int(11) DEFAULT 1,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.level_roles
CREATE TABLE IF NOT EXISTS `level_roles` (
  `guild_id` varchar(255) NOT NULL,
  `role_id` varchar(255) NOT NULL,
  `required_level` int(11) NOT NULL DEFAULT 6,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.level_settings
CREATE TABLE IF NOT EXISTS `level_settings` (
  `guild_id` varchar(255) NOT NULL,
  `level_channel_id` varchar(255) DEFAULT NULL,
  `points_to_next_level` int(11) DEFAULT 100,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.member_tracking
CREATE TABLE IF NOT EXISTS `member_tracking` (
  `user_id` varchar(20) NOT NULL,
  `guild_id` varchar(20) NOT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.reaction_roles
CREATE TABLE IF NOT EXISTS `reaction_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild_id` varchar(255) NOT NULL,
  `message_id` varchar(255) NOT NULL,
  `emoji` varchar(255) NOT NULL,
  `role_id` varchar(255) NOT NULL,
  `channel_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_id` (`message_id`,`emoji`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.server_config
CREATE TABLE IF NOT EXISTS `server_config` (
  `guild_id` varchar(20) NOT NULL,
  `default_role_id` varchar(20) DEFAULT NULL,
  `welcome_channel_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(255) NOT NULL,
  `warnings` int(11) DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.user_levels
CREATE TABLE IF NOT EXISTS `user_levels` (
  `user_id` varchar(20) NOT NULL,
  `guild_id` varchar(20) NOT NULL,
  `points` int(11) DEFAULT 0,
  `level` int(11) DEFAULT 1,
  PRIMARY KEY (`user_id`,`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle discord.user_warnings
CREATE TABLE IF NOT EXISTS `user_warnings` (
  `user_id` bigint(20) NOT NULL,
  `warning_count` int(11) DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Daten-Export vom Benutzer nicht ausgewählt

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
