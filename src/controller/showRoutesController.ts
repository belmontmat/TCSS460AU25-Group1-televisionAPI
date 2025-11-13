/**
 * Controller logic for managing TV shows
 */

import { getPool } from '@/core/utilities/database';
import { cQueries } from '@/core/utilities/cQueries';
import { ShowSummary, ShowsResponse, ShowDetail, ShowResponse, NetworkResponse, GenreResponse, CompanyResponse, ActorsResponse, ShowsFilterResponse } from '@/types/responseTypes';
import { convertResponsesToShowDetail, convertShowResponsesToShowSummary } from '@/core/utilities/convert';
import { QueryResult } from 'pg';

export const getShowList = async (page: number, limit: number): Promise<ShowsResponse> => {
  const offset = (page - 1) * limit;

  const pool = getPool();

  const countResult = await pool.query('SELECT COUNT(*) FROM tv_show');
  const totalCount = parseInt(countResult.rows[0].count);

  const result = await pool.query(
    cQueries.getShows() + ' LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const summaries: ShowSummary[] = result.rows.map(show => (convertShowResponsesToShowSummary(show)));
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
    cQueries.getShowByIdQuery(),
    [id]
  );

  // if there are no shows matching, return nulll
  if (showResult.rows.length === 0) {
    return null;
  }

  const show: ShowResponse = showResult.rows[0];  // store the show data itself

  // Get network
  const networkResult: QueryResult<NetworkResponse> = await pool.query(
    cQueries.getNetworkInfoByFilterQuery(filter),
    [show.show_id]
  );

  // Get actors
  const actorsResult: QueryResult<ActorsResponse> = await pool.query(
    cQueries.getActorsInfoByCharacterQuery(filter),
    [show.show_id]
  );

  // Get genres
  const genreResult: QueryResult<GenreResponse> = await pool.query(
    cQueries.getGenresByFilterQuery(filter),
    [show.show_id]
  );

  // Get companies
  const companyResult: QueryResult<CompanyResponse> = await pool.query(
    cQueries.getCompanyByFilterQuery(filter),
    [show.show_id]
  );

  return convertResponsesToShowDetail(showResult, genreResult, networkResult, companyResult, actorsResult);
};

export const getRandomShows = async (count: number): Promise<ShowSummary[]> => {
  const pool = getPool();

  const result = await pool.query(
    cQueries.getRandomShowsQuery(),
    [count]
  );

  const summaries: ShowSummary[] = result.rows.map(show => (convertShowResponsesToShowSummary(show)));
  return summaries;
};

export const getLongestRunning = async (limit: number): Promise<ShowSummary[]> => {
  const pool = getPool();

  const result = await pool.query(
    `SELECT show_id, name, original_name, first_air_date, status, seasons, episodes, tmdb_rating, popularity, poster_url, last_air_date
     FROM tv_show
     ORDER BY AGE(last_air_date, first_air_date) DESC
     LIMIT $1`,
    [limit]
  );

  const summaries: ShowSummary[] = result.rows.map(show => (convertShowResponsesToShowSummary(show)));
  return summaries;
};

export const getPopular = async (limit: number): Promise<ShowSummary[]> => {
  const pool = getPool();

  const result = await pool.query(
    `SELECT show_id, name, original_name, first_air_date, status, seasons, episodes, tmdb_rating, popularity, poster_url, last_air_date
     FROM tv_show
     ORDER BY popularity DESC
     LIMIT $1`,
    [limit]
  );

  const summaries: ShowSummary[] = result.rows.map(show => (convertShowResponsesToShowSummary(show)));
  return summaries;
};

export const getTopRated = async (limit: number): Promise<ShowSummary[]> => {
  const pool = getPool();

  const result = await pool.query(
    `SELECT show_id, name, original_name, first_air_date, status, seasons, episodes, tmdb_rating, popularity, poster_url, last_air_date
     FROM tv_show
     ORDER BY tmdb_rating DESC
     LIMIT $1`,
    [limit]
  );

  const summaries: ShowSummary[] = result.rows.map(show => (convertShowResponsesToShowSummary(show)));
  return summaries;
};

// Claude helped a lot with crafting the dynamic query
export const getShowByFilter = async (
  actors: string,
  genres: string,
  network: string,
  studios: string,
  status: string,
  minRating: number,
  maxRating: number,
  startDate: string,
  endDate: string,
  country: string,
  creators: string,
  name: string,
  page: number,
  limit: number): Promise<ShowsFilterResponse> => {
  const pool = getPool();

  const conditions = [];
  const values = [];
  let paramCount = 1;

  // Base query with JOINs
  let query = `
      SELECT DISTINCT s.*
      FROM tv_show s
  `;

  // Join tables as needed based on filters
  const joins = [];

  if (actors) {
    const actorList = actors.split(',').map(a => a.trim());
    const actorConditions = actorList.map(() => `a.name ILIKE $${paramCount++}`).join(' OR ');
    joins.push('INNER JOIN characters ch ON s.show_id = ch.show_id');
    joins.push('INNER JOIN actors a ON ch.actor_id = a.actor_id');
    conditions.push(`(${actorConditions})`);
    actorList.forEach(actor => values.push(`%${actor}%`));
}

if (genres) {
    const genreList = genres.split(',').map(g => g.trim());
    const genreConditions = genreList.map(() => `g.name ILIKE $${paramCount++}`).join(' OR ');
    joins.push('INNER JOIN show_genres sg ON s.show_id = sg.show_id');
    joins.push('INNER JOIN genres g ON sg.genre_id = g.genre_id');
    conditions.push(`(${genreConditions})`);
    genreList.forEach(genreName => values.push(`%${genreName}%`));
}

if (creators) {
    const creatorList = creators.split(',').map(c => c.trim());
    const creatorConditions = creatorList.map(() => `s.creators ILIKE $${paramCount++}`).join(' OR ');
    conditions.push(`(${creatorConditions})`);
    creatorList.forEach(creator => values.push(`%${creator}%`));
}

  if (network) {
      joins.push('INNER JOIN networks n ON s.network_id = n.network_id');
      conditions.push(`n.name ILIKE $${paramCount++}`);
      values.push(`%${network}%`);
  }

  if (studios) {
      joins.push('INNER JOIN show_companies sc ON s.show_id = sc.show_id');
      joins.push('INNER JOIN company c ON sc.company_id = c.company_id');
      conditions.push(`c.name ILIKE $${paramCount++}`);
      values.push(`%${studios}%`);
  }

  // Direct tv_show table filters
  if (status) {
      conditions.push(`s.status ILIKE $${paramCount++}`);
      values.push(status);
  }

  if (startDate) {
      conditions.push(`s.first_air_date >= $${paramCount++}`);
      values.push(startDate);
  }

  if (endDate) {
      conditions.push(`s.last_air_date <= $${paramCount++}`);
      values.push(endDate);
  }

  if (minRating) {
      conditions.push(`s.tmdb_rating >= $${paramCount++}`);
      values.push(minRating);
  }

  if (maxRating) {
      conditions.push(`s.tmdb_rating <= $${paramCount++}`);
      values.push(maxRating);
  }

  if (country) {
      conditions.push(`s.network_country ILIKE $${paramCount++}`);
      values.push(`%${country}%`);
  }

  if (name) {
    conditions.push(`(s.name ILIKE $${paramCount} OR s.original_name ILIKE $${paramCount})`);
    values.push(`%${name}%`);
    paramCount++;
}

  // Remove duplicate joins
  const uniqueJoins = [...new Set(joins)];

  // Build final query
  query += uniqueJoins.join('\n');

  if (conditions.length > 0) {
      query += '\nWHERE ' + conditions.join(' AND ');
  }

  const countQuery = `
    SELECT COUNT(DISTINCT s.show_id) as total
    FROM tv_show s
    ${uniqueJoins.join('\n')}
    ${conditions.length > 0 ? '\nWHERE ' + conditions.join(' AND ') : ''}
`;

// Execute count query with the same values (excluding limit/offset)
const countResult = await pool.query(countQuery, values);
const totalCount = parseInt(countResult.rows[0].total);

  query += `\nORDER BY s.show_id
  LIMIT $${paramCount++} OFFSET $${paramCount++}`;

  const offset = (page - 1) * limit;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  const summaries: ShowSummary[] = result.rows.map(show => (convertShowResponsesToShowSummary(show)));



  return {
      count: totalCount || 0,
      page,
      limit,
      filters: {
        actors: actors,
        genres: genres,
        network: network,
        studios: studios,
        status: status,
        minRating: minRating,
        maxRating: maxRating,
        startDate: startDate,
        endDate: endDate,
        country: country,
        creators: creators,
        name: name
      },
      data: summaries
  };
};