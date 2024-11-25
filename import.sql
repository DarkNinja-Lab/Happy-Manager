CREATE TABLE bump_settings (
    guild_id VARCHAR(20) PRIMARY KEY,
    role_id VARCHAR(20) NOT NULL,
    channel_id VARCHAR(20) NOT NULL
);


CREATE TABLE IF NOT EXISTS levels (
    user_id VARCHAR(255) PRIMARY KEY,
    guild_id VARCHAR(255),
    points INT DEFAULT 0,
    level INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS level_settings (
    guild_id VARCHAR(255) PRIMARY KEY,
    level_channel_id VARCHAR(255),
    points_to_next_level INT DEFAULT 100
);
