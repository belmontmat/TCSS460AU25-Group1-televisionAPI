/**
 * Controller logic for managing genres
 */

import { getPool } from '@/core/utilities/database';
import { GenreCountResponse } from '@/types/responseTypes';

export const getGenreList = async (): Promise<GenreCountResponse[]> => {

  const pool = getPool();

  const result = await pool.query(
    'SELECT genre_id, name FROM genres ORDER BY genre_id ASC'
  );

  const genres: GenreCountResponse[] = result.rows.map(genre => ({
    genre_id: parseInt(genre.genre_id),
    name: genre.name,
    show_count: parseInt(genre.count),
    percentage: (parseInt(genre.percentage))
  }));
  
  return genres;
};