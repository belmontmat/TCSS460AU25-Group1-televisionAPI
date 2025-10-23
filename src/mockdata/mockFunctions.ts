import { ShowSummary, ShowsResponse } from '@/types/responseTypes';
import { mockShowsData } from '../mockdata/mockShows';

const data = mockShowsData;

export const getShowList = async (page: number, limit: number): Promise<ShowsResponse> =>{
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = data.slice(start, end);

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
        count: summaries.length,
        page,
        limit,
        data: summaries
    };
};