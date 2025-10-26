/**
 * Controller logic for managing stats and aggregations
 */

import { getPool } from '@/core/utilities/database';
import { AggregateResponse, AggregateResponseID } from '@/types/responseTypes';

export const getGenreStats = async (): Promise<AggregateResponseID[]> => {

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

  const genreCounts: AggregateResponseID[] = result.rows.map(row => ({
        id: parseInt(row.genre_id),
        name: row.name,
        show_count: parseInt(row.show_count),
        avg_rating: parseFloat(row.avg_rating).toFixed(2),
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));
  
  return genreCounts;
};

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
        avg_rating: parseFloat(row.avg_rating).toFixed(2),
        min_rating: parseFloat(row.min_rating),
        max_rating: parseFloat(row.max_rating)
    }));

  
  return networkCounts;
};