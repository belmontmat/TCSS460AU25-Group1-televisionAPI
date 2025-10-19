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
}
