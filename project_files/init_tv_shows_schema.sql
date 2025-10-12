-- PostgreSQL Database Initialization Script
-- TV Shows Database Schema

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS tv_show CASCADE;
DROP TABLE IF EXISTS actors CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS networks CASCADE;
DROP TABLE IF EXISTS genres CASCADE;

-- Create genres table
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create networks table
CREATE TABLE networks (
    network_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    countries VARCHAR(500)
);

-- Create company table
CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    countries VARCHAR(500)
);

-- Create actors table
CREATE TABLE actors (
    actor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_url VARCHAR(500)
);

-- Create tv_show table
CREATE TABLE tv_show (
    show_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    first_air_date DATE,
    last_air_date DATE,
    seasons INTEGER,
    episodes INTEGER,
    status VARCHAR(50),
    overview TEXT,
    popularity FLOAT,
    tmdb_rating FLOAT,
    vote_count INTEGER,
    creators VARCHAR(500),
    poster_url VARCHAR(500),
    backdrop_url VARCHAR(500),
    network_id INTEGER REFERENCES networks(network_id) ON DELETE SET NULL,
    genre_id INTEGER REFERENCES genres(genre_id) ON DELETE SET NULL,
    company1 INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    company2 INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    company3 INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    company4 INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    company5 INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    company6 INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    company7 INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    company8 INTEGER REFERENCES company(company_id) ON DELETE SET NULL
);

-- Create characters table (junction table for many-to-many relationship)
CREATE TABLE characters (
    show_id VARCHAR(50) NOT NULL,
    actor_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    order_num INTEGER,
    PRIMARY KEY (show_id, actor_id),
    FOREIGN KEY (show_id) REFERENCES tv_show(show_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(actor_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_tv_show_network ON tv_show(network_id);
CREATE INDEX idx_tv_show_genre ON tv_show(genre_id);
CREATE INDEX idx_characters_show ON characters(show_id);
CREATE INDEX idx_characters_actor ON characters(actor_id);

-- Add comments to tables for documentation
COMMENT ON TABLE genres IS 'TV show genres/categories';
COMMENT ON TABLE networks IS 'Broadcasting networks';
COMMENT ON TABLE company IS 'Production companies';
COMMENT ON TABLE actors IS 'Actors appearing in TV shows';
COMMENT ON TABLE tv_show IS 'Main TV show information';
COMMENT ON TABLE characters IS 'Characters and their actors in TV shows';
