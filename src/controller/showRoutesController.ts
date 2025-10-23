/**
 * Controller logic for managing TV shows
 */

import { getPool } from '@/core/utilities/database';
import { cQueries } from '@/core/utilities/cQueries';
import { ShowSummary, ShowsResponse, ShowDetail, ShowResponse } from '@/types/responseTypes';
import { convertResponsesToShowDetail, convertShowResponsesToShowSummary } from '@/core/utilities/convert';


export const getShowList = async (page: number, limit: number): Promise<ShowsResponse> => {
  const offset = (page - 1) * limit;

  const pool = getPool();

  const countResult = await pool.query('SELECT COUNT(*) FROM tv_show');
  const totalCount = parseInt(countResult.rows[0].count);

  const result = await pool.query(
    `SELECT show_id, name, original_name, first_air_date, status,
      seasons, episodes, tmdb_rating, popularity, poster_url
      FROM tv_show
      LIMIT ${limit} OFFSET ${offset}`
  );

  const summaries: ShowSummary[] = result.rows.map(show => (convertShowResponsesToShowSummary(show))); // THIS IS FAILING
  return {
      count: totalCount,
      page,
      limit,
      data: summaries
  };
};

export const getShowById = async (id: number): Promise<ShowDetail | null> => {
  // get db connection
  const pool = getPool();
  const filter = 'show_id';
  
  // query the database for the show with the specified ID
  const showResult = await pool.query(
    cQueries.getShowByIdQuery(id)
  );

  // if there are no shows matching, return nulll
  if (showResult.rows.length === 0) {
    return null;
  }

  const show: ShowResponse = showResult.rows[0];  // store the show data itself

  // Get network
  const networkResult = await pool.query(
    cQueries.getNetworkInfoByFilterQuery(filter, show.show_id)
  );

  // Get actors
  const actorsResult = await pool.query(
    cQueries.getActorsInfoByCharacterQuery(filter, show.show_id)
  );

  // Get genres
  const genreResult = await pool.query(
    cQueries.getGenresByFilterQuery(filter, show.show_id)
  );

  // Get companies
  const companyResult = await pool.query(
    cQueries.getCompanyByFilterQuery(filter, show.show_id)
  );

  return convertResponsesToShowDetail(showResult, genreResult, networkResult, companyResult, actorsResult);
};