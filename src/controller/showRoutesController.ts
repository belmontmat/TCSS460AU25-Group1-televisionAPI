/**
 * Controller logic for managing TV shows
 */

import { getPool } from '@/core/utilities/database';
import { cQueries } from '@/core/utilities/cQueries';
import { ShowSummary, ShowsResponse, ShowDetail } from '@/types/responseTypes';


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

  const summaries: ShowSummary[] = result.rows.map(show => ({
        show_id: show.show_id,
        name: show.name,
        original_name: show.original_name,
        first_air_date: show.first_air_date,
        status: show.status,
        seasons: show.seasons,
        episodes: show.episodes,
        tmdb_rating: show.tmdb_rating,
        popularity: show.popularity,
        poster_url: show.poster_url
  }));

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

  const show = showResult.rows[0];  // store the show data itself

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

  return {
    show_id: show.show_id,
    name: show.name,
    original_name: show.original_name,
    first_air_date: show.first_air_date,
    last_air_date: show.last_air_date,
    seasons: show.seasons,
    episodes: show.episodes,
    status: show.status,
    overview: show.overview,
    popularity: show.popularity,
    tmdb_rating: show.tmdb_rating,
    vote_count: show.vote_count,
    creators: show.creators.split(';'),
    poster_url: show.poster_url,
    backdrop_url: show.backdrop_url,
    genres: genreResult.rows.map(row => ({
      genre_id: row.genre_id,
      name: row.name
    })),
    networks: networkResult.rows,
    companies: companyResult.rows.map(row => ({
      company_id: row.company_id,
      name: row.name,
      logo: row.logo,
      countries: row.countries
    })),
    actors: actorsResult.rows.map(row => ({
      actor_id: row.actor_id,
      name: row.name,
      character: row.character,
      profile_url: row.profile_url,
      order_num: row.order_num
    }))
  };
};