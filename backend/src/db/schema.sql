CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 phone_number VARCHAR(20),
 profile_picture TEXT,
 password_hash VARCHAR(255),
 google_id VARCHAR(255) UNIQUE,
 role VARCHAR(20) NOT NULL DEFAULT 'guest'
 CHECK (role IN ('guest', 'admin')),
 account_status VARCHAR(20) NOT NULL DEFAULT 'active'
 CHECK (account_status IN ('active', 'blocked')),
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 CHECK (password_hash IS NOT NULL OR google_id IS NOT NULL)
);

