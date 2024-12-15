-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS synced_watch;

-- Switch to using the database
USE synced_watch;

-- Check if timer_on table exists and create if it doesn't
CREATE TABLE IF NOT EXISTS timer_on (
    id INT PRIMARY KEY AUTO_INCREMENT,
    started TINYINT(1) DEFAULT 0,
    start_time BIGINT DEFAULT 0,
    get_ready TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Check if we need to insert the initial record
INSERT INTO timer_on (id, started, start_time, get_ready)
SELECT 1, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM timer_on WHERE id = 1);

-- Add get_ready column if it doesn't exist (for backward compatibility)
SET @dbname = 'synced_watch';
SET @tablename = 'timer_on';
SET @columnname = 'get_ready';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  'ALTER TABLE timer_on ADD COLUMN get_ready TINYINT(1) DEFAULT 0'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Grant necessary permissions (adjust username and password as needed)
GRANT SELECT, INSERT, UPDATE ON synced_watch.* TO 'root'@'localhost' IDENTIFIED BY 'timerbusinesstime';
FLUSH PRIVILEGES;
