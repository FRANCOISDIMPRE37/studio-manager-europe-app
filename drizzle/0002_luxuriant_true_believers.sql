CREATE TABLE `smtp_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`host` varchar(200) NOT NULL DEFAULT 'smtp.ionos.fr',
	`port` int NOT NULL DEFAULT 587,
	`secure` boolean NOT NULL DEFAULT false,
	`user` varchar(320) NOT NULL DEFAULT '',
	`password` text NOT NULL DEFAULT (''),
	`fromName` varchar(200),
	`replyTo` varchar(320),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `smtp_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `smtp_config_userId_unique` UNIQUE(`userId`)
);
