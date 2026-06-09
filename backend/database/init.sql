-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    placement VARCHAR(100) NOT NULL,
	button_text VARCHAR(50),
	action_target VARCHAR(100),
	target_audience VARCHAR(50) DEFAULT 'ALL',
    enabled BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    event_id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_message
        FOREIGN KEY (message_id)
        REFERENCES messages(message_id)
        ON DELETE CASCADE
);

