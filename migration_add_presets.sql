USE synced_watch;

CREATE TABLE IF NOT EXISTS timer_presets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(20) NOT NULL,
    hours INT NOT NULL DEFAULT 0,
    minutes INT NOT NULL DEFAULT 0,
    seconds INT NOT NULL DEFAULT 0,
    is_negative BOOLEAN DEFAULT FALSE
);

INSERT INTO timer_presets (label, minutes, is_negative) VALUES ('5min', 5, false);
INSERT INTO timer_presets (label, minutes, is_negative) VALUES ('10min', 10, false);
INSERT INTO timer_presets (label, minutes, is_negative) VALUES ('15min', 15, false);
INSERT INTO timer_presets (label, minutes, is_negative) VALUES ('30min', 30, false);
INSERT INTO timer_presets (label, seconds, is_negative) VALUES ('-30sec', 30, true);
INSERT INTO timer_presets (label, minutes, is_negative) VALUES ('-1min', 1, true);
