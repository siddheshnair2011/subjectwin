CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stripeCheckoutSessionId` varchar(255) NOT NULL,
	`productId` int NOT NULL,
	`stripeConnectAccountId` varchar(255) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`amountInCents` int NOT NULL,
	`applicationFeeInCents` int NOT NULL,
	`status` enum('pending','completed','failed','canceled') NOT NULL DEFAULT 'pending',
	`customerEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_stripeCheckoutSessionId_unique` UNIQUE(`stripeCheckoutSessionId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stripeProductId` varchar(255) NOT NULL,
	`stripeConnectAccountId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`priceInCents` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'usd',
	`stripePriceId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_stripeProductId_unique` UNIQUE(`stripeProductId`)
);
--> statement-breakpoint
CREATE TABLE `stripeConnectAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeAccountId` varchar(255) NOT NULL,
	`displayName` varchar(255),
	`contactEmail` varchar(320),
	`onboardingStatus` enum('pending','in_progress','completed','failed') NOT NULL DEFAULT 'pending',
	`requirementsDue` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripeConnectAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripeConnectAccounts_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `stripeConnectAccounts_stripeAccountId_unique` UNIQUE(`stripeAccountId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeConnectAccountId` varchar(255);