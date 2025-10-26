export interface ShowSummary {
  show_id: number;
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
  network: { network_id: number; name: string; logo: string; country: string };
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

export interface ShowsFilterResponse {
  count: number;
  page: number;
  limit: number;
  filters: {
    actors: string, // actor names comma separated
    genres: string, // genre names semicolon-separated
    network: string,
    studios: string, // studio names semicolon-separated
    status: string,
    minRating: number,
    maxRating: number,
    startDate: string,
    endDate: string,
    country: string,
    creators: string,
    name: string,
  };
  data: ShowSummary[];
}

export interface ShowResponse {
  show_id: string;
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date: string;
  seasons: number;
  episodes: number;
  status: string;
  overview: string;
  popularity: number;
  tmdb_rating: number;
  vote_count: number;
  creators: string;
  poster_url: string;
  backdrop_url: string;
}

export interface GenreResponse {
  genre_id: number;
  name: string;
}

export interface NetworkResponse {
  network_id: number;
  name: string;
  logo: string;
  country: string;
}

export interface CompanyResponse {
  company_id: number;
  name: string;
  logo: string;
  countries: string;
}

export interface ActorsResponse {
  actor_id: number;
  name: string;
  profile_url: string;
  character: string;
  order_num: number;
}

export interface AggregateResponseID extends AggregateResponse {
  id: number;
}

export interface AggregateResponse {
  name: string;
  show_count: number;
  avg_rating: string;
  min_rating: number;
  max_rating: number;
}