/**
 * Controller logic for managing stats and aggregations
 */

import { getPool } from '@/core/utilities/database';
import { GenreCountResponse } from '@/types/responseTypes';

export const getGenreStats = async (): Promise<GenreCountResponse[]> => {

  const pool = getPool();

  const result = await pool.query(`
        SELECT 
            g.genre_id, 
            g.name, 
            COUNT(sg.show_id) AS show_count
        FROM genres g
        LEFT JOIN show_genres sg ON g.genre_id = sg.genre_id
        GROUP BY g.genre_id, g.name
        ORDER BY show_count DESC
    `);

  const genreCounts = result.rows.map(row => ({
        genre_id: parseInt(row.genre_id),
        name: row.name,
        show_count: parseInt(row.show_count)
    }));
  
  return genreCounts;
};