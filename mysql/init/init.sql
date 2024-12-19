CREATE TABLE IF NOT EXISTS timer_on (
    id INT PRIMARY KEY AUTO_INCREMENT,
    started TINYINT(1) DEFAULT 0,
    start_time BIGINT DEFAULT 0,
    get_ready TINYINT(1) DEFAULT 0
);

-- Insert initial record
INSERT INTO timer_on (id, started, start_time, get_ready) 
VALUES (1, 0, 0, 0)
ON DUPLICATE KEY UPDATE id=id;
