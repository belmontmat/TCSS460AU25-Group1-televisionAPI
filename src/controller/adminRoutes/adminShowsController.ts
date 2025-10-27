// adminShowsController.ts
import { Request, Response } from 'express';
import { getPool } from '@/core/utilities/database';

interface ShowData {
  name: string;
  original_name?: string;
  first_air_date?: string;
  last_air_date?: string;
  seasons?: number;
  episodes?: number;
  status?: string;
  overview?: string;
  popularity?: number;
  tmdb_rating?: number;
  vote_count?: number;
  poster_url?: string;
  backdrop_url?: string;
  genres?: number[] | string[];
  network?: number | string;
  network_logo?: string;
  network_country?: string;
  companies?: number[] | string[];
  company_logos?: string[];
  company_countries?: string[];
  creators?: string;
  characters?: Array<{
    actor_name: string;
    character_name: string;
    profile_url?: string;
    order_num?: number;
  }>;
}

/**
 * Adds a new show to the database
 */
export const addShow = async (request: Request, response: Response): Promise<void> => {
  try {
    const showData: ShowData = request.body;
    const pool = getPool();

    // Begin transaction
    await pool.query('BEGIN');

    try {
      // Process genres - get or create genre IDs
      const genreIds: number[] = [];
      if (showData.genres && showData.genres.length > 0) {
        for (const genre of showData.genres) {
          if (typeof genre === 'number') {
            genreIds.push(genre);
          } else {
            // Check if genre exists
            const existingGenre = await pool.query(
              'SELECT genre_id FROM genres WHERE LOWER(name) = LOWER($1)',
              [genre]
            );
            
            if (existingGenre.rows.length > 0) {
              genreIds.push(existingGenre.rows[0].genre_id);
            } else {
              // Create new genre
              const newGenre = await pool.query(
                'INSERT INTO genres (name) VALUES ($1) RETURNING genre_id',
                [genre]
              );
              genreIds.push(newGenre.rows[0].genre_id);
            }
          }
        }
      }

      // Process network - get or create network ID
      let networkId: number | null = null;
      if (showData.network) {
        if (typeof showData.network === 'number') {
          networkId = showData.network;
        } else {
          // Check if network exists
          const existingNetwork = await pool.query(
            'SELECT network_id FROM networks WHERE LOWER(name) = LOWER($1)',
            [showData.network]
          );
          
          if (existingNetwork.rows.length > 0) {
            networkId = existingNetwork.rows[0].network_id;
          } else {
            // Create new network
            const newNetwork = await pool.query(
              'INSERT INTO networks (name, logo, countries) VALUES ($1, $2, $3) RETURNING network_id',
              [showData.network, showData.network_logo || null, showData.network_country || null]
            );
            networkId = newNetwork.rows[0].network_id;
          }
        }
      }

      // Process companies - get or create company IDs
      const companyIds: number[] = [];
      if (showData.companies && showData.companies.length > 0) {
        for (let i = 0; i < showData.companies.length; i++) {
          const company = showData.companies[i];
          if (typeof company === 'number') {
            companyIds.push(company);
          } else {
            // Check if company exists
            const existingCompany = await pool.query(
              'SELECT company_id FROM company WHERE LOWER(name) = LOWER($1)',
              [company]
            );
            
            if (existingCompany.rows.length > 0) {
              companyIds.push(existingCompany.rows[0].company_id);
            } else {
              // Create new company
              const companyLogo = showData.company_logos?.[i] || null;
              const companyCountries = showData.company_countries?.[i] || null;
              const newCompany = await pool.query(
                'INSERT INTO company (name, logo, countries) VALUES ($1, $2, $3) RETURNING company_id',
                [company, companyLogo, companyCountries]
              );
              companyIds.push(newCompany.rows[0].company_id);
            }
          }
        }
      }

      // Insert the show
      const showResult = await pool.query(
        `INSERT INTO tv_show (
          name, original_name, first_air_date, last_air_date, 
          seasons, episodes, status, overview, popularity, tmdb_rating,
          vote_count, poster_url, backdrop_url, network_id, network_country, creators
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING show_id, name, original_name, first_air_date, last_air_date, 
                  seasons, episodes, status, overview, popularity, tmdb_rating,
                  vote_count, poster_url, backdrop_url, network_id, network_country, creators`,
        [
          showData.name,
          showData.original_name || null,
          showData.first_air_date || null,
          showData.last_air_date || null,
          showData.seasons || null,
          showData.episodes || null,
          showData.status || null,
          showData.overview || null,
          showData.popularity || null,
          showData.tmdb_rating || null,
          showData.vote_count || null,
          showData.poster_url || null,
          showData.backdrop_url || null,
          networkId,
          showData.network_country || null,
          showData.creators || null
        ]
      );

      const newShow = showResult.rows[0];
      const showId = newShow.show_id;

      // Insert genre associations
      if (genreIds.length > 0) {
        for (const genreId of genreIds) {
          await pool.query(
            'INSERT INTO show_genres (show_id, genre_id) VALUES ($1, $2)',
            [showId, genreId]
          );
        }
      }

      // Insert company associations
      if (companyIds.length > 0) {
        for (const companyId of companyIds) {
          await pool.query(
            'INSERT INTO show_companies (show_id, company_id) VALUES ($1, $2)',
            [showId, companyId]
          );
        }
      }

      // Process characters/actors if provided
      if (showData.characters && showData.characters.length > 0) {
        for (const character of showData.characters) {
          // Check if actor exists
          let actorId: number;
          const existingActor = await pool.query(
            'SELECT actor_id FROM actors WHERE LOWER(name) = LOWER($1)',
            [character.actor_name]
          );
          
          if (existingActor.rows.length > 0) {
            actorId = existingActor.rows[0].actor_id;
          } else {
            // Create new actor
            const newActor = await pool.query(
              'INSERT INTO actors (name, profile_url) VALUES ($1, $2) RETURNING actor_id',
              [character.actor_name, character.profile_url || null]
            );
            actorId = newActor.rows[0].actor_id;
          }

          // Insert character record
          await pool.query(
            'INSERT INTO characters (show_id, actor_id, name, order_num) VALUES ($1, $2, $3, $4)',
            [showId, actorId, character.character_name, character.order_num || null]
          );
        }
      }

      await pool.query('COMMIT');

      response.status(201).json({
        ...newShow,
        genres: genreIds,
        companies: companyIds
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error adding show:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Updates an existing show's information
 */
export const updateShow = async (request: Request, response: Response): Promise<void> => {
  try {
    if (!request.params.id) {
      response.status(400).json({ error: 'Show ID is required' });
      return;
    }

    const showId = parseInt(request.params.id);
    if (isNaN(showId)) {
      response.status(400).json({ error: 'Invalid show ID' });
      return;
    }

    const showData: ShowData = request.body;
    const pool = getPool();

    // Begin transaction
    await pool.query('BEGIN');

    try {
      // Update the show
      const updateResult = await pool.query(
        `UPDATE tv_show SET 
          name = $1, original_name = $2, first_air_date = $3, last_air_date = $4,
          seasons = $5, episodes = $6, status = $7, overview = $8, 
          poster_url = $9, backdrop_url = $10, network_id = $11, 
          network_country = $12, creators = $13
        WHERE show_id = $14
        RETURNING show_id, name, original_name, first_air_date, last_air_date, 
                  seasons, episodes, status, overview, poster_url, backdrop_url, 
                  network_id, network_country, creators`,
        [
          showData.name,
          showData.original_name || null,
          showData.first_air_date || null,
          showData.last_air_date || null,
          showData.seasons || null,
          showData.episodes || null,
          showData.status || null,
          showData.overview || null,
          showData.poster_url || null,
          showData.backdrop_url || null,
          showData.network || null,
          showData.network_country || null,
          showData.creators || null,
          showId
        ]
      );

      if (updateResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        response.status(404).json({ error: 'Show not found' });
        return;
      }

      const updatedShow = updateResult.rows[0];

      // Update genres associations
      if (showData.genres !== undefined) {
        await pool.query('DELETE FROM show_genres WHERE show_id = $1', [showId]);
        if (showData.genres.length > 0) {
          for (const genreId of showData.genres) {
            await pool.query(
              'INSERT INTO show_genres (show_id, genre_id) VALUES ($1, $2)',
              [showId, genreId]
            );
          }
        }
      }

      // Update companies associations
      if (showData.companies !== undefined) {
        await pool.query('DELETE FROM show_companies WHERE show_id = $1', [showId]);
        if (showData.companies.length > 0) {
          for (const companyId of showData.companies) {
            await pool.query(
              'INSERT INTO show_companies (show_id, company_id) VALUES ($1, $2)',
              [showId, companyId]
            );
          }
        }
      }

      await pool.query('COMMIT');

      response.status(200).json({
        ...updatedShow,
        genres: showData.genres || [],
        companies: showData.companies || []
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating show:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Deletes a show by ID
 */
export const deleteShow = async (request: Request, response: Response): Promise<void> => {
  try {
    if (!request.params.id) {
      response.status(400).json({ error: 'Show ID is required' });
      return;
    }

    const showId = parseInt(request.params.id);
    if (isNaN(showId)) {
      response.status(400).json({ error: 'Invalid show ID' });
      return;
    }

    const pool = getPool();

    // Begin transaction
    await pool.query('BEGIN');

    try {
      // Check if show exists
      const existingShow = await pool.query(
        'SELECT show_id FROM tv_show WHERE show_id = $1',
        [showId]
      );

      if (existingShow.rows.length === 0) {
        await pool.query('ROLLBACK');
        response.status(404).json({ error: 'Show not found' });
        return;
      }

      // Delete associated records
      await pool.query('DELETE FROM show_genres WHERE show_id = $1', [showId]);
      await pool.query('DELETE FROM show_companies WHERE show_id = $1', [showId]);

      // Delete the show
      await pool.query('DELETE FROM tv_show WHERE show_id = $1', [showId]);

      await pool.query('COMMIT');

      response.status(200).json({
        message: 'Show deleted successfully',
        showId: showId
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting show:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};