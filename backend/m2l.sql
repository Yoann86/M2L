-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           10.4.27-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour contexte_m2l
CREATE DATABASE IF NOT EXISTS `contexte_m2l` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `contexte_m2l`;

-- Listage de la structure de la table contexte_m2l. compte
CREATE TABLE IF NOT EXISTS `compte` (
  `uuid` varchar(32) NOT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mdp` varchar(100) DEFAULT NULL,
  `estadmin` int(11) DEFAULT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Listage des données de la table contexte_m2l.compte : ~1 rows (environ)
INSERT INTO `compte` (`uuid`, `prenom`, `nom`, `email`, `mdp`, `estadmin`) VALUES
	('130e30e3-e84a-42e6-a4ee-3261a972', 'b', 'b', 'b', '$2b$10$bchu6URaE9s606sqqX.wFe/OdNqiWplS.83hGrg6Lt.fX9s9fbyQS', 1);

-- Listage de la structure de la table contexte_m2l. panier
CREATE TABLE IF NOT EXISTS `panier` (
  `id` int(11) NOT NULL,
  `uuid_compte` varchar(32) DEFAULT NULL,
  `uuid_produit` varchar(32) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_panier_produit` (`uuid_produit`),
  KEY `FK_panier_compte` (`uuid_compte`),
  CONSTRAINT `FK_panier_compte` FOREIGN KEY (`uuid_compte`) REFERENCES `compte` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_panier_produit` FOREIGN KEY (`uuid_produit`) REFERENCES `produit` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Listage des données de la table contexte_m2l.panier : ~0 rows (environ)
INSERT INTO `panier` (`id`, `uuid_compte`, `uuid_produit`, `quantite`) VALUES
	(0, '130e30e3-e84a-42e6-a4ee-3261a972', '6decd76a-35db-41cc-a57c-4fa1bbd2', 1);

-- Listage de la structure de la table contexte_m2l. produit
CREATE TABLE IF NOT EXISTS `produit` (
  `uuid` varchar(32) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `prix` int(11) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  `visibilite` int(11) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Listage des données de la table contexte_m2l.produit : ~0 rows (environ)
INSERT INTO `produit` (`uuid`, `nom`, `description`, `prix`, `quantite`, `visibilite`, `image`) VALUES
	('6decd76a-35db-41cc-a57c-4fa1bbd2', 'test test', 'test', 32, 7, NULL, 'uploads\\chezTalion_logo_fond_transparent.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
