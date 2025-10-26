// Conversion utilities for actor data

import { ActorsSummary, ActorShow } from '@/types/responseTypes';
import { QueryResult } from 'pg';

/**
 * Converts the return data from the database to the format
 * specified by the API documentation.
 * 
 * @param results database query results of type ActorsSummary
 * @returns An object with actor information conforming to ActorsSummary type
 */
export const convertActorsSummary = (results: QueryResult<ActorsSummary>): ActorsSummary[] => {
    // Note, the formats are the same so conversion isn't strictly necessary,
    // but should the API or database change this will be useful.
    return results.rows.map(actor => ({
        actor_id: actor.actor_id,
        name: actor.name,
        profile_url: actor.profile_url
    }));
};

export const convertActorShows = (results: QueryResult): ActorShow[] => {
    return results.rows.map(row => ({
        show_id: row.show_id,
        name: row.name,
        character: row.character_name
    }));
};
