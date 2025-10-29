/**
 * Controller logic for managing stats and aggregations
 */

import { getPool } from '@/core/utilities/database';
import { AggregateResponse } from '@/types/responseTypes';

export const getGenreStats = async (): Promise<AggregateResponse[]> => {

  const pool = getPool();

  const result = await pool.query(`
        SELECT 
            g.genre_id,
            g.name, 
            COUNT(DISTINCT s.show_id) AS show_count,
            AVG(s.tmdb_rating) AS avg_rating,
            MIN(s.tmdb_rating) AS min_rating,
            MAX(s.tmdb_rating) AS max_rating
        FROM genres g
        INNER JOIN show_genres sg ON g.genre_id = sg.genre_id
        INNER JOIN tv_show s ON sg.show_id = s.show_id
        WHERE s.tmdb_rating IS NOT NULL
        GROUP BY g.genre_id, g.name
        ORDER BY show_count DESC
    `);

  const genreCounts: AggregateResponse[] = result.rows.map(row => ({
        id: parseInt(row.genre_id),
        name: row.name,
        show_count: parseInt(row.show_count),
        avg_rating: Math.round(parseFloat(row.avg_rating) * 100) / 100,
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));
  
  return genreCounts;
};

// Network stats does not return IDs since networks have multiple IDs for the same network name (different countries)
export const getNetworkStats = async (): Promise<AggregateResponse[]> => {

  const pool = getPool();

  const result = await pool.query(`
        SELECT
            n.name, 
            COUNT(s.show_id) AS show_count,
            AVG(s.tmdb_rating) AS avg_rating,
            MIN(s.tmdb_rating) AS min_rating,
            MAX(s.tmdb_rating) AS max_rating
        FROM networks n
        LEFT JOIN tv_show s ON n.network_id = s.network_id
        WHERE s.tmdb_rating IS NOT NULL
        GROUP BY n.name
        ORDER BY show_count DESC
    `);
    
    const networkCounts: AggregateResponse[] = result.rows.map(row => ({
        name: row.name,
        show_count: parseInt(row.show_count),
        avg_rating: Math.round(parseFloat(row.avg_rating) * 100) / 100,
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));

  
  return networkCounts;
};

export const getActorStats = async (): Promise<AggregateResponse[]> => { //This needs to be tested when the actors data is repopulated (duplicates)
    const pool = getPool();
    const result = await pool.query(`
        SELECT 
            a.actor_id,
            a.name, 
            COUNT(DISTINCT ch.show_id) AS show_count,
            AVG(s.tmdb_rating) AS avg_rating,
            MIN(s.tmdb_rating) AS min_rating,
            MAX(s.tmdb_rating) AS max_rating
        FROM actors a
        INNER JOIN characters ch ON a.actor_id = ch.actor_id
        INNER JOIN tv_show s ON ch.show_id = s.show_id
        WHERE s.tmdb_rating IS NOT NULL
        GROUP BY a.actor_id, a.name
        ORDER BY show_count DESC
        LIMIT 100
    `);

    
    const actorStats: AggregateResponse[] = result.rows.map(row => ({
        id: parseInt(row.actor_id),
        name: row.name,
        show_count: parseInt(row.show_count),
        avg_rating: Math.round(parseFloat(row.avg_rating) * 100) / 100,
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));
    
    return actorStats;
};

export const getYearStats = async (): Promise<AggregateResponse[]> => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT 
            EXTRACT(YEAR FROM first_air_date) AS year,
            COUNT(show_id) AS show_count,
            AVG(s.tmdb_rating) AS avg_rating,
            MIN(s.tmdb_rating) AS min_rating,
            MAX(s.tmdb_rating) AS max_rating
        FROM tv_show as s
        WHERE first_air_date IS NOT NULL
        GROUP BY EXTRACT(YEAR FROM first_air_date)
        ORDER BY year DESC
    `);
    
    const yearStats: AggregateResponse[] = result.rows.map(row => ({
        year: parseInt(row.year),
        show_count: parseInt(row.show_count),
        avg_rating: Math.round(parseFloat(row.avg_rating) * 100) / 100,
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));
    
    return yearStats;
};

export const getCountryStats = async (): Promise<AggregateResponse[]> => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT 
            network_country, 
            COUNT(show_id) AS show_count,
            AVG(s.tmdb_rating) AS avg_rating,
            MIN(s.tmdb_rating) AS min_rating,
            MAX(s.tmdb_rating) AS max_rating
        FROM tv_show as s
        WHERE network_country IS NOT NULL
        GROUP BY network_country
        ORDER BY show_count DESC
    `);
    
    const countryStats: AggregateResponse[] = result.rows.map(row => ({
        country: row.network_country,
        show_count: parseInt(row.show_count),
        avg_rating: Math.round(parseFloat(row.avg_rating) * 100) / 100,
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));
    
    return countryStats;
};

export const getStatusStats = async (): Promise<AggregateResponse[]> => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT 
            status, 
            COUNT(show_id) AS show_count,
            AVG(s.tmdb_rating) AS avg_rating,
            MIN(s.tmdb_rating) AS min_rating,
            MAX(s.tmdb_rating) AS max_rating
        FROM tv_show as s
        WHERE status IS NOT NULL
        GROUP BY status
        ORDER BY show_count DESC
    `);
    
    const statusStats: AggregateResponse[] = result.rows.map(row => ({
        status: row.status,
        show_count: parseInt(row.show_count),
        avg_rating: Math.round(parseFloat(row.avg_rating) * 100) / 100,
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));
    
    return statusStats;
};

export const getCompanyStats = async (): Promise<AggregateResponse[]> => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT 
            c.name, 
            COUNT(DISTINCT s.show_id) AS show_count,
            AVG(s.tmdb_rating) AS avg_rating,
            MIN(s.tmdb_rating) AS min_rating,
            MAX(s.tmdb_rating) AS max_rating
        FROM company c
        INNER JOIN show_companies sc ON c.company_id = sc.company_id
        INNER JOIN tv_show s ON sc.show_id = s.show_id
        WHERE s.tmdb_rating IS NOT NULL
        GROUP BY c.name
        ORDER BY show_count DESC
    `);
    
    const companyRatings: AggregateResponse[] = result.rows.map(row => ({
        name: row.name,
        show_count: parseInt(row.show_count),
        avg_rating: Math.round(parseFloat(row.avg_rating) * 100) / 100,
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));
    
    return companyRatings;
};