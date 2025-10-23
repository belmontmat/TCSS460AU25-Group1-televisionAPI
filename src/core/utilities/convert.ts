import { ShowDetail, ShowResponse, GenreResponse, NetworkResponse, CompanyResponse, ActorsResponse } from '@/types/responseTypes';
import { QueryResult } from 'pg';

export const convertResponsesToShowDetail = (
    showResult: QueryResult<ShowResponse>,
    genreResult: QueryResult<GenreResponse>,
    networkResult: QueryResult<NetworkResponse>,
    companyResult: QueryResult<CompanyResponse>,
    actorsResult: QueryResult<ActorsResponse>): ShowDetail | null => {

    const network = networkResult.rows[0];
    const show = showResult.rows[0];

    if (!show || !network) {
        return null;
    }

    return {
        show_id: parseInt(show.show_id),
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
        network: {
            network_id: network.network_id,
            name: network.name,
            logo: network.logo,
            country: network.country
        },
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