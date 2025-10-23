export class cQueries {
    // Will return a query string to get network info based on tv_show filters
    // Ex. filter could be a tv_show db key like 'show_id' and value could be 111111
    static getNetworkInfoByFilterQuery(filter: string, value: number): string {
        return `SELECT 
      n.network_id,
      n.name AS network_name,
      n.logo AS network_logo,
      ts.network_country
      FROM tv_show ts
      JOIN networks n ON ts.network_id = n.network_id
      WHERE ts.${filter} = ${value}`;
    }

    // Will return a query string to get actors info based on character filters
    // Ex. filter could be a character db key like 'name' and value could be 'Walter White'
    //      or 
    static getActorsInfoByCharacterQuery(filter: string, value: number): string {
        return `SELECT a.actor_id, a.name, a.profile_url, c.name as character, c.order_num
      FROM actors a
      JOIN characters c ON a.actor_id = c.actor_id
      WHERE c.${filter} = ${value}
      ORDER BY c.order_num`;
    }


    // Will return a query string to get production company info based on tv_show filters
    // Ex. filter could be a shows or company db key like 'show_id' and value could be '111111'
    //      or 'company_id' and value could be '22222'
    //      or 'company_name' and value could be 'Pixar Studios'
    //      or 'company_country' and value could be 'USA'
    static getCompanyByFilterQuery(filter: string, value: number): string {
        return `SELECT company.company_id, company.name, company.logo, company.countries
      FROM company
      JOIN show_companies ON company.company_id = show_companies.company_id
      WHERE show_companies.${filter} = ${value}`;
    }

    // Will return a query string to get genres name from genre_id or genre_id from name
    static getGenresByFilterQuery(filter: string, value: number): string {
        return `SELECT genres.genre_id, genres.name FROM genres
      JOIN show_genres ON genres.genre_id = show_genres.genre_id
      WHERE show_genres.${filter} = ${value}`;
    }

    // Will return a query string to get a show's full info by its ID
    static getShowByIdQuery(id: number): string {
        return `SELECT * FROM tv_show WHERE show_id = ${id}`;
    }
}