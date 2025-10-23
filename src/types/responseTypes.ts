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
  creators: Array<string>;
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