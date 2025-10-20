-- TV Shows Database Schema
-- PostgreSQL Compatible Initialization Script

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS show_companies CASCADE;
DROP TABLE IF EXISTS show_genres CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS actors CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS tv_show CASCADE;
DROP TABLE IF EXISTS networks CASCADE;

-- Create networks table
CREATE TABLE networks (
    network_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500)
);

-- Create tv_show table
CREATE TABLE tv_show (
    show_id SERIAL PRIMARY KEY,
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
    network_id INTEGER,
    network_country VARCHAR(255),
    FOREIGN KEY (network_id) REFERENCES networks(network_id) ON DELETE SET NULL
);

-- Create genres table
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create company table
CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    countries VARCHAR(255)
);

-- Create actors table
CREATE TABLE actors (
    actor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_url VARCHAR(500)
);

-- Create show_genres junction table
CREATE TABLE show_genres (
    show_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    PRIMARY KEY (show_id, genre_id),
    FOREIGN KEY (show_id) REFERENCES tv_show(show_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

-- Create show_companies junction table
CREATE TABLE show_companies (
    show_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    PRIMARY KEY (show_id, company_id),
    FOREIGN KEY (show_id) REFERENCES tv_show(show_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);

-- Create characters junction table
CREATE TABLE characters (
    show_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    order_num INTEGER,
    PRIMARY KEY (show_id, actor_id, name),
    FOREIGN KEY (show_id) REFERENCES tv_show(show_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(actor_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_tv_show_network ON tv_show(network_id);
CREATE INDEX idx_tv_show_name ON tv_show(name);
CREATE INDEX idx_show_genres_show ON show_genres(show_id);
CREATE INDEX idx_show_genres_genre ON show_genres(genre_id);
CREATE INDEX idx_show_companies_show ON show_companies(show_id);
CREATE INDEX idx_show_companies_company ON show_companies(company_id);
CREATE INDEX idx_characters_show ON characters(show_id);
CREATE INDEX idx_characters_actor ON characters(actor_id);

-- Add comments to tables for documentation
COMMENT ON TABLE tv_show IS 'Main table storing TV show information';
COMMENT ON TABLE networks IS 'TV networks that air shows';
COMMENT ON TABLE genres IS 'Genre categories for TV shows';
COMMENT ON TABLE company IS 'Production companies';
COMMENT ON TABLE actors IS 'Actors who appear in TV shows';
COMMENT ON TABLE show_genres IS 'Junction table linking shows to genres (many-to-many)';
COMMENT ON TABLE show_companies IS 'Junction table linking shows to production companies (many-to-many)';
COMMENT ON TABLE characters IS 'Junction table linking shows, actors, and character names (many-to-many)';