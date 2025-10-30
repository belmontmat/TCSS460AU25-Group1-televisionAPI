export class cQueries {
    // Will return a query string to get network info based on tv_show filters
    // Ex. filter could be a tv_show db key like 'show_id'
    // Note: filter parameter is still used for column name (not user input)
    static getNetworkInfoByFilterQuery(filter: string): string {
        // filter should be a safe column name, not user input
        return `SELECT 
      n.network_id,
      n.name,
      n.logo,
      ts.network_country AS country
      FROM tv_show ts
      JOIN networks n ON ts.network_id = n.network_id
      WHERE ts.${filter} = $1`;
    }

    // Will return a query string to get actors info based on character filters
    // Ex. filter could be a character db key like 'show_id'
    static getActorsInfoByCharacterQuery(filter: string): string {
        return `SELECT a.actor_id, a.name, a.profile_url, c.name as character, c.order_num
      FROM actors a
      JOIN characters c ON a.actor_id = c.actor_id
      WHERE c.${filter} = $1
      ORDER BY c.order_num`;
    }


    // Will return a query string to get production company info based on tv_show filters
    // Ex. filter could be a shows or company db key like 'show_id'
    static getCompanyByFilterQuery(filter: string): string {
        return `SELECT company.company_id, company.name, company.logo, company.countries
      FROM company
      JOIN show_companies ON company.company_id = show_companies.company_id
      WHERE show_companies.${filter} = $1`;
    }

    // Will return a query string to get genres by filter
    static getGenresByFilterQuery(filter: string): string {
        return `SELECT genres.genre_id, genres.name FROM genres
      JOIN show_genres ON genres.genre_id = show_genres.genre_id
      WHERE show_genres.${filter} = $1`;
    }

    // Will return a query string to get a show's full info by its ID
    static getShowByIdQuery(): string {
        return 'SELECT * FROM tv_show WHERE show_id = $1';
    }

    // Will return a query string to get all shows' summary info
    static getShows(): string {
        return `SELECT show_id, name, original_name, first_air_date, status, seasons, episodes, tmdb_rating, popularity, poster_url
      FROM tv_show`;
    }

    static getRandomShowsQuery(): string {
        return `SELECT show_id, name, original_name, first_air_date, status, seasons, episodes, tmdb_rating, popularity, poster_url
      FROM tv_show
      ORDER BY RANDOM()
      LIMIT $1`;
    }
}