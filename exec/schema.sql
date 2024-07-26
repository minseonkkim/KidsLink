DROP DATABASE IF EXISTS `kidslink`;
CREATE SCHEMA `kidslink` ;
USE `kidslink`;

CREATE TABLE `kindergarten` (
    `kindergarten_id` INT NOT NULL AUTO_INCREMENT,
    `kindergarten_name` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`kindergarten_id`)
);

CREATE TABLE `kindergarten_class` (
    `kindergarten_class_id` INT NOT NULL AUTO_INCREMENT,
    `kindergarten_id` INT NOT NULL,
    `kindergarten_class_name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`kindergarten_class_id`, `kindergarten_id`),
    FOREIGN KEY (`kindergarten_id`) REFERENCES `kindergarten`(`kindergarten_id`)
);

CREATE TABLE `schedule` (
    `schedule_id` INT NOT NULL AUTO_INCREMENT,
    `schedule_date` DATE NULL,
    `schedule_name` VARCHAR(100) NULL,
    `kindergarten_id` INT NOT NULL,
    PRIMARY KEY (`schedule_id`),
    FOREIGN KEY (`kindergarten_id`) REFERENCES `kindergarten`(`kindergarten_id`)
);

CREATE TABLE `notice_board` (
    `notice_board_id` INT NOT NULL AUTO_INCREMENT,
    `notice_board_title` VARCHAR(256) NULL,
    `notice_board_content` VARCHAR(2000) NOT NULL,
    `notice_board_date` DATE NULL,
    `kindergarten_class_id` INT NOT NULL,
    `kindergarten_id` INT NOT NULL,
    PRIMARY KEY (`notice_board_id`),
    FOREIGN KEY (`kindergarten_class_id`, `kindergarten_id`) REFERENCES `kindergarten_class`(`kindergarten_class_id`, `kindergarten_id`)
);

CREATE TABLE `parent` (
    `parent_id` INT NOT NULL AUTO_INCREMENT,
    `parent_username` VARCHAR(100) NULL,
    `parent_name` VARCHAR(25) NULL,
    `parent_password` VARCHAR(100) NULL,
    `parent_nickname` VARCHAR(100) NULL,
    `parent_tel` VARCHAR(25) NULL,
    `parent_email` VARCHAR(100) NULL,
    `parent_profile` VARCHAR(255) NULL,
    PRIMARY KEY (`parent_id`)
);

CREATE TABLE `child` (
    `child_id` INT NOT NULL AUTO_INCREMENT,
    `child_name` VARCHAR(100) NULL,
    `child_gender` ENUM('F', 'M') NULL,
    `child_birth` VARCHAR(100) NULL,
    `child_profile` VARCHAR(255) NULL,
    `kindergarten_class_id` INT NOT NULL,
    `kindergarten_id` INT NOT NULL,
    `parent_id` INT NOT NULL,
    PRIMARY KEY (`child_id`),
    FOREIGN KEY (`kindergarten_class_id`, `kindergarten_id`) REFERENCES `kindergarten_class`(`kindergarten_class_id`, `kindergarten_id`),
    FOREIGN KEY (`parent_id`) REFERENCES `parent`(`parent_id`)
);

CREATE TABLE `teacher` (
    `teacher_id` INT NOT NULL AUTO_INCREMENT,
    `teacher_name` VARCHAR(25) NULL,
    `teacher_username` VARCHAR(100) NULL,
    `teacher_password` VARCHAR(100) NULL,
    `teacher_nickname` VARCHAR(100) NULL,
    `teacher_email` VARCHAR(100) NULL,
    `teacher_tel` VARCHAR(25) NULL,
    `teacher_profile` VARCHAR(255) NULL,
    `kindergarten_class_id` INT NOT NULL,
    `kindergarten_id` INT NOT NULL,
    PRIMARY KEY (`teacher_id`),
    FOREIGN KEY (`kindergarten_class_id`, `kindergarten_id`) REFERENCES `kindergarten_class`(`kindergarten_class_id`, `kindergarten_id`)
);

CREATE TABLE `teacher_schedule` (
    `teacher_schedule_id` INT NOT NULL AUTO_INCREMENT,
    `teacher_schedule_date` DATETIME NULL,
    `teacher_schedule_contents` VARCHAR(1000) NULL,
    `teacher_id` INT NOT NULL,
    PRIMARY KEY (`teacher_schedule_id`),
    FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`teacher_id`)
);

CREATE TABLE `album` (
    `album_id` INT NOT NULL AUTO_INCREMENT,
    `album_name` VARCHAR(100) NULL,
    `album_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `child_id` INT NOT NULL,
    PRIMARY KEY (`album_id`),
    FOREIGN KEY (`child_id`) REFERENCES `child`(`child_id`)
);

CREATE TABLE `diary` (
    `diary_id` INT NOT NULL AUTO_INCREMENT,
    `diary_date` DATE NULL COMMENT 'now()',
    `diary_contents` VARCHAR(2000) NULL,
    `diary_thumbnail` VARCHAR(255) NULL,
    `child_id` INT NOT NULL,
    PRIMARY KEY (`diary_id`),
    FOREIGN KEY (`child_id`) REFERENCES `child`(`child_id`)
);

CREATE TABLE `absent` (
    `absent_id` INT NOT NULL AUTO_INCREMENT,
    `absent_startdate` DATE NULL,
    `absent_enddate` DATE NULL,
    `absent_reason` VARCHAR(1000) NULL,
    `absent_details` VARCHAR(1000) NULL,
    `confirmation_status` ENUM('T', 'F') DEFAULT 'F',
    `child_id` INT NOT NULL,
    PRIMARY KEY (`absent_id`),
    FOREIGN KEY (`child_id`) REFERENCES `child`(`child_id`)
);

CREATE TABLE `dosage` (
    `dosage_id` INT NOT NULL AUTO_INCREMENT,
    `dosage_name` VARCHAR(500) NULL,
    `dosage_startdate` DATE NULL,
    `dosage_enddate` DATE NULL,
    `dosage_volume` VARCHAR(500) NULL,
    `dosage_num` VARCHAR(500) NULL,
    `dosage_time` VARCHAR(500) NULL,
    `dosage_store` VARCHAR(500) NULL,
    `dosage_details` VARCHAR(1000) NULL,
    `confirmation_status` ENUM('T', 'F') DEFAULT 'F',
    `child_id` INT NOT NULL,
    PRIMARY KEY (`dosage_id`),
    FOREIGN KEY (`child_id`) REFERENCES `child`(`child_id`)
);

CREATE TABLE `bus_stop` (
    `bus_stop_id` INT NOT NULL AUTO_INCREMENT,
    `bus_stop_name` VARCHAR(100) NULL,
    PRIMARY KEY (`bus_stop_id`)
);

CREATE TABLE `meeting_schedule` (
    `meeting_schedule_id` INT NOT NULL AUTO_INCREMENT,
    `meeting_schedule_date` VARCHAR(25) NULL,
    `meeting_schedule_time` VARCHAR(25) NULL,
    `teacher_id` INT NOT NULL,
    `parent_id` INT NOT NULL,
    PRIMARY KEY (`meeting_schedule_id`),
    FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`teacher_id`),
    FOREIGN KEY (`parent_id`) REFERENCES `parent`(`parent_id`)
);

CREATE TABLE `parent_notification` (
    `parent_notification_id` INT NOT NULL AUTO_INCREMENT,
    `parent_id` INT NOT NULL,
    `code` ENUM('dosage','absent','meeting') NULL,
    `parent_notification_text` VARCHAR(100) NULL,
    `confirmation_status` ENUM('T', 'F') DEFAULT 'F',
    PRIMARY KEY (`parent_notification_id`),
    FOREIGN KEY (`parent_id`) REFERENCES `parent`(`parent_id`)
);

CREATE TABLE `teacher_notification` (
    `teacher_notification_id` INT NOT NULL AUTO_INCREMENT,
    `teacher_id` INT NOT NULL,
    `code` VARCHAR(50) NULL,
    `teacher_notification_text` VARCHAR(100) NULL,
    `confirmation_status` ENUM('T', 'F') DEFAULT 'F',
    PRIMARY KEY (`teacher_notification_id`),
    FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`teacher_id`)
);

CREATE TABLE `meeting_time` (
    `meeting_time_id` INT NOT NULL AUTO_INCREMENT,
    `meeting_time` VARCHAR(50) NULL,
    `teacher_id` INT NOT NULL,
    `meeting_date` VARCHAR(50) NULL,
    PRIMARY KEY (`meeting_time_id`),
    FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`teacher_id`)
);

CREATE TABLE `image` (
    `image_id` INT NOT NULL AUTO_INCREMENT,
    `save_folder` VARCHAR(200) NULL,
    `original_file` VARCHAR(50) NULL,
    `save_file` VARCHAR(50) NULL,
    PRIMARY KEY (`image_id`)
);

CREATE TABLE `image_album` (
    `image_id` INT NOT NULL,
    `album_id` INT NOT NULL,
    PRIMARY KEY (`image_id`, `album_id`),
    FOREIGN KEY (`image_id`) REFERENCES `image`(`image_id`),
    FOREIGN KEY (`album_id`) REFERENCES `album`(`album_id`)
);

CREATE TABLE `image_diary` (
    `image_id` INT NOT NULL,
    `diary_id` INT NOT NULL,
    PRIMARY KEY (`image_id`, `diary_id`),
    FOREIGN KEY (`image_id`) REFERENCES `image`(`image_id`),
    FOREIGN KEY (`diary_id`) REFERENCES `diary`(`diary_id`)
);

CREATE TABLE `bus_stop_child` (
    `child_id` INT NOT NULL,
    `bus_stop_id` INT NOT NULL,
    `bus_boarding_status` ENUM('T','F') NULL,
    PRIMARY KEY (`child_id`, `bus_stop_id`),
    FOREIGN KEY (`child_id`) REFERENCES `child`(`child_id`),
    FOREIGN KEY (`bus_stop_id`) REFERENCES `bus_stop`(`bus_stop_id`)
);
