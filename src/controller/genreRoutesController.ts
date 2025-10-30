/**
 * Controller logic for managing genres
 */

import { getPool } from '@/core/utilities/database';
import { GenreEndpointResponse, GenreResponse } from '@/types/responseTypes';

export const getGenreList = async (): Promise<GenreEndpointResponse> => {

  const pool = getPool();

  const result = await pool.query(
    'SELECT genre_id, name FROM genres ORDER BY genre_id ASC'
  );

  const genres: GenreResponse[] = result.rows.map(genre => ({
    genre_id: parseInt(genre.genre_id),
    name: genre.name
  }));
  
  return {
    count: genres.length,
    data: genres
  };
};