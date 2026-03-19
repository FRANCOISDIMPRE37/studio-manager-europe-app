CREATE TABLE `clients` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`nom` varchar(100) NOT NULL,
	`prenom` varchar(100) NOT NULL,
	`dateNaissance` varchar(10) NOT NULL,
	`adresse` text,
	`codePostal` varchar(10),
	`ville` varchar(100),
	`telephone` varchar(20) NOT NULL,
	`email` varchar(320),
	`pieceIdentiteType` enum('CNI','Passeport','Permis','Autre'),
	`pieceIdentiteNumero` varchar(50),
	`estMineur` boolean NOT NULL DEFAULT false,
	`estArchive` boolean NOT NULL DEFAULT false,
	`dateArchivage` varchar(10),
	`dateConsentement` varchar(10),
	`dateSuppressionPrevue` varchar(10) NOT NULL,
	`rgpdDroitsExerces` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(36) NOT NULL,
	`clientId` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`status` enum('empty','filled','signed') NOT NULL DEFAULT 'empty',
	`data` json DEFAULT ('{}'),
	`signatureClient` text,
	`signatureProfessionnel` text,
	`signatureRepresentant` text,
	`dateSigned` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prestations` (
	`id` varchar(36) NOT NULL,
	`clientId` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`type` enum('piercing','tatouage','dermographie') NOT NULL,
	`zone` varchar(200) NOT NULL,
	`description` text,
	`photos` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prestations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rendez_vous` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`clientId` varchar(36),
	`clientNom` varchar(200),
	`clientTelephone` varchar(20),
	`date` varchar(10) NOT NULL,
	`heureDebut` varchar(5) NOT NULL,
	`heureFin` varchar(5) NOT NULL,
	`type` enum('piercing','tatouage','dermographie','consultation','retouche','autre') NOT NULL,
	`zone` varchar(200),
	`notes` text,
	`statut` enum('confirme','en_attente','annule','termine') NOT NULL DEFAULT 'confirme',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rendez_vous_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salon_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nom` varchar(200) NOT NULL DEFAULT 'Mon Studio',
	`raisonSociale` varchar(200),
	`adresse` text,
	`codePostal` varchar(10),
	`ville` varchar(100),
	`telephone` varchar(20),
	`email` varchar(320),
	`siret` varchar(20),
	`nomPierceur` varchar(200),
	`nomTatoueur` varchar(200),
	`nomDermographe` varchar(200),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salon_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `salon_settings_userId_unique` UNIQUE(`userId`)
);
