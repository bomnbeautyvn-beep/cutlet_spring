CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant_config (
    id VARCHAR(50) PRIMARY KEY,
    config_value VARCHAR(255) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO restaurant_config (id, config_value, description) VALUES ('vat_rate', '0.08', 'Configured restaurant VAT rate (8%)');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('default_prep_minutes', '18', 'Default order preparation time in minutes');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('opening_hour_lunch_start', '11:00', 'Lunch service start');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('opening_hour_lunch_end', '15:00', 'Lunch service end');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('opening_hour_dinner_start', '17:00', 'Dinner service start');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('opening_hour_dinner_end', '21:00', 'Dinner service end');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('last_order_time', '20:30', 'Dinner last order time');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('capacity_hall', '30', 'Max guests in Main Atelier Hall per slot');
INSERT INTO restaurant_config (id, config_value, description) VALUES ('capacity_counter', '10', 'Max guests at Chef Counter Theater per slot');
