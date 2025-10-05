-- Database schema for AidConnect+ application

-- Users table (for donors)
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords, never plain text
    phone_number VARCHAR(255),
    address_line1 VARCHAR(255),
    postal_code VARCHAR(255),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME default NULL,
    role VARCHAR(50) DEFAULT 'donor' -- e.g., 'donor', 'admin', 'organization_user'
);
-- Organizations table (for NGOs)
CREATE TABLE Organizations (
    organization_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    website_url VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    address_line1 VARCHAR(255),
    postal_code VARCHAR(255),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (for token management)
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(128) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    user_agent TEXT,
    ip VARCHAR(45),
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Campaigns (
    campaign_id INT auto_increment primary key,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    fundraising_goal DECIMAL(12,2) NOT NULL,
    category ENUM('Education', 'Health', 'Environment', 'Community', 'Other') NOT NULL,
    location VARCHAR(255) NOT NULL,
    emergency BOOLEAN DEFAULT FALSE,
    tag VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    image_url VARCHAR(500),
    raised_amount DECIMAL(12,2) default 0,
    donors INT default 0,
    status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (organization_id) REFERENCES Organizations(organization_id)
        ON DELETE CASCADE
);

CREATE TABLE DonationTypes (
    donation_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('money', 'food', 'clothes', 'medical-supplies') UNIQUE NOT NULL
);

CREATE TABLE CampaignDonationTypes (
    campaign_id INT NOT NULL,
    donation_type_id INT NOT NULL,
    PRIMARY KEY (campaign_id, donation_type_id),
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (donation_type_id) REFERENCES DonationTypes(donation_type_id) ON DELETE CASCADE
);
