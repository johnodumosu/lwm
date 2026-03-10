-- ============================================================
--  Living Word Ministry – Men's Ministry Membership
--  MySQL Database Setup Script
-- ============================================================

CREATE DATABASE IF NOT EXISTS living_word_ministry
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE living_word_ministry;

-- Dedicated app user (change the password before running!)
CREATE USER IF NOT EXISTS 'lwm_user'@'localhost' IDENTIFIED BY 'change_me';
GRANT SELECT, INSERT, UPDATE ON living_word_ministry.* TO 'lwm_user'@'localhost';
FLUSH PRIVILEGES;

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id                       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    full_name                VARCHAR(255)  NOT NULL,
    date_of_birth            VARCHAR(10)   NOT NULL COMMENT 'DD/MM only',
    marital_status           ENUM('Single','Married','Widowed','Divorced','Separated') NOT NULL,
    phone                    VARCHAR(30)   NOT NULL,
    email                    VARCHAR(255)  NULL,
    residential_address      TEXT          NOT NULL,
    occupation               VARCHAR(255)  NULL,
    church_department        VARCHAR(255)  NULL,
    date_joined              DATE          NOT NULL,
    emergency_contact_name   VARCHAR(255)  NOT NULL,
    emergency_contact_number VARCHAR(30)   NOT NULL,
    member_signature         VARCHAR(255)  NOT NULL,
    signature_date           DATE          NULL,
    approved_by              VARCHAR(255)  NULL,
    approver_signature       VARCHAR(255)  NULL,
    submitted_at             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_full_name    (full_name),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DESCRIBE members;
