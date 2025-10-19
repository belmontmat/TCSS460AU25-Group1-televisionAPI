/**
 * Controller logic for managing TV shows
 */

import { mockShowsData } from '../mockdata/mockShows';
import { getPool } from '@/core/utilities/database';

export interface ShowSummary {
  show_id: string;
  name: string;
  original_name: string;
  first_air_date: string;
  status: string;
  seasons: number;
  episodes: number;
  tmdb_rating: number;
  popularity: number;
  poster_url: string;
}

export interface ShowDetail extends ShowSummary {
  last_air_date: string;
  overview: string;
  vote_count: number;
  backdrop_url: string;
  creators: string;
  genres: Array<{ genre_id: number; name: string }>;
  networks: Array<{ network_id: number; name: string; logo: string; countries: string }>;
  companies: Array<{ company_id: number; name: string; logo: string; countries: string }>;
  actors: Array<{
    actor_id: number;
    name: string;
    character: string;
    profile_url: string;
    order_num: number;
  }>;
}


export interface ShowsResponse {
  count: number;
  page: number;
  limit: number;
  data: ShowSummary[];
}

export interface IShowRepository {
  getShowList(page: number, limit: number): Promise<ShowsResponse>;
  getShowById(id: number): Promise<ShowDetail | null>
}

export class ShowRepo implements IShowRepository {
  async getShowList(page: number, limit: number): Promise<ShowsResponse> {
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
  }

  async getShowById(id: number): Promise<ShowDetail | null> {
    // get db connection
    const pool = getPool();
    
    // query the database for the show with the specified ID
    const showResult = await pool.query(
      `SELECT * FROM tv_show WHERE show_id = ${id}`
    );

    // if there are no shows matching, return nulll
    if (showResult.rows.length === 0) {
      return null;
    }

    const show = showResult.rows[0];  // store the show data itself

    // Get network
    const networkResult = await pool.query(
      `SELECT 
      n.network_id,
      n.name AS network_name,
      n.logo AS network_logo,
      ts.network_country
      FROM tv_show ts
      JOIN networks n ON ts.network_id = n.network_id
      WHERE ts.show_id = ${show.show_id}`
    );

    // Get actors
    const actorsResult = await pool.query(
      `SELECT a.actor_id, a.name, a.profile_url, c.name as character, c.order_num
      FROM actors a
      JOIN characters c ON a.actor_id = c.actor_id
      WHERE c.show_id = ${show.show_id}
      ORDER BY c.order_num`
    );

    // Get genres
    const genreResult = await pool.query(
      `SELECT genres.genre_id, genres.name FROM genres
      JOIN show_genres ON genres.genre_id = show_genres.genre_id
      WHERE show_genres.show_id = ${show.show_id}`
    );

    // Get companies
    const companyResult = await pool.query(
      `SELECT company.company_id, company.name, company.logo, company.countries
      FROM company
      JOIN show_companies ON company.company_id = show_companies.company_id
      WHERE show_companies.show_id = ${show.show_id}`
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
      creators: show.creators,
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
  }
}

export class MockShowRepo implements IShowRepository {
    private data: ShowDetail[] = mockShowsData;

    async getShowList(page: number, limit: number): Promise<ShowsResponse> {
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = this.data.slice(start, end);

        // Convert to ShowSummary (remove fields not applicable to this function)
        const summaries: ShowSummary[] = paginatedData.map(show => ({
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
            count: this.data.length,
            page,
            limit,
            data: summaries
        };
    }

    async getShowById(id: number): Promise<ShowDetail | null> {
      return null;
    }
}
