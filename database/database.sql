DROP DATABASE IF EXISTS `wikiwhat`;

CREATE DATABASE `wikiwhat`;
USE `wikiwhat`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `users` (
    `id`              INT           NOT NULL AUTO_INCREMENT,
    `username`        VARCHAR(20)   NOT NULL,
    -- update password, use bcyrpt to encrypt
    `password`        VARCHAR(40)   NOT NULL,
    `date_created`    DATETIME      NOT NULL,

    PRIMARY KEY (`id`)
) ENGINE=INNODB;

DROP TABLE IF EXISTS `scores`;
CREATE TABLE `scores` (
    `id`              INT           NOT NULL AUTO_INCREMENT,
    `total_correct`   INT           NOT NULL DEFAULT 0,
    `num_games`       INT           NOT NULL DEFAULT 0,
    `streak`          INT           NOT NULL DEFAULT 0,
    `user_id`         INT           NOT NULL,

    PRIMARY KEY (`id`),
    INDEX (`user_id`),
    FOREIGN KEY `user_id` REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=INNODB;

DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
    `id`              INT           NOT NULL AUTO_INCREMENT,
    `title`           VARCHAR(250)  NOT NULL,
    `image_url`       VARCHAR(255)  NOT NULL,
    `scores`          INT           NOT NULL DEFAULT 0,
    `author_id`       INT           NOT NULL,

    PRIMARY KEY(`id`),
    INDEX (`author_id`),
    FOREIGN KEY `author_id` REFERENCES `users`(`id`)
) ENGINE=INNODB;
