import { Request, Response } from 'express';
import { getPool } from '@/core/utilities/database';
import { QueryResult } from 'pg';
import { ActorShow, ActorShowEndpointReponse, ActorsSummary } from '@/types/responseTypes';
import { convertActorShows, convertActorsSummary } from '@/core/utilities/convertActors';

// GET ACTORS

export const getActors = async (request: Request, response: Response) => {
    try {
        // get page and limit parameters
        const { page, limit, offset } = getPaginationParams(request);
        const nameQuery = request.query.name as string | undefined;
        const pool = getPool();

        // Query strings to use
        const countQuery: string = 'SELECT COUNT(*) FROM actors';
        const countQueryWithName: string = 'SELECT COUNT(*) FROM actors WHERE name ILIKE $1';
        const dataQuery: string = 'SELECT * FROM actors LIMIT $1 OFFSET $2';
        const dataQueryWithName: string = 'SELECT * FROM actors WHERE name ILIKE $1 LIMIT $2 OFFSET $3';

        // Check if a name filter is present in the request
        // (validation checks already performed in prior middleware)
        const hasNameFilter = nameQuery && nameQuery.trim() !== '';

        if (hasNameFilter) {
            const searchPattern = `%${nameQuery.trim()}%`;
            const countResult = await pool.query(countQueryWithName, [searchPattern]);
            const totalCount = parseInt(countResult.rows[0].count);

            const result: QueryResult<ActorsSummary> = await pool.query(
                dataQueryWithName,
                [searchPattern, limit, offset]
            );

            const summaries: ActorsSummary[] = convertActorsSummary(result);

            response.json({
                count: totalCount,
                page: page,
                data: summaries
            });
        } else {
            const countResult = await pool.query(countQuery);
            const totalCount = parseInt(countResult.rows[0].count);

            const result: QueryResult<ActorsSummary> = await pool.query(
                dataQuery,
                [limit, offset]
            );

            const summaries: ActorsSummary[] = convertActorsSummary(result);

            response.json({
                count: totalCount,
                page: page,
                data: summaries
            });
        }
    } catch (error) {
        response.status(500).json({error: 'Internal server error' + error});
    }
};

// Helpers for getActors
const getPaginationParams = (request: Request) => {
    const page = Math.max(parseInt(request.query.page as string), 1) || 1;
    const limit = Math.min(parseInt(request.query.limit as string), 100) || 50;
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
};


// GET BY ID

export const getActorById = async(request: Request, response: Response) => {
    try {
        const pool = getPool();
        const actorId = parseInt(request.params.id as string);
        const result: QueryResult<ActorsSummary> = await pool.query(
            'SELECT actor_id, name, profile_url FROM actors WHERE actor_id=$1',
            [actorId]
        );

        if (result.rows.length === 0) {
            response.status(404).json({
                error: 'Actor not found.'
            });
        } else {
            const summaries: ActorsSummary[] = convertActorsSummary(result);

            response.json(
                summaries[0]
            );
        }

    } catch (error) {
        response.status(500).json({error: 'Internal server error' + error});
    }
};


// GET ACTOR SHOWS

export const getActorShowsById = async(request: Request, response: Response) => {
    // (1) Get actor information
    // (2) get character and show information

    try {
        const actorId = parseInt(request.params.id as string);
        
        const pool = getPool();

        // (1) Get actor information
        const result = await pool.query(
            'SELECT actor_id, name, profile_url FROM actors WHERE actor_id = $1',
            [actorId]
        );

        if (result.rows.length === 0) {
            response.status(404).json({
                error: 'Actor not found.'
            });
            return;
        }

        const actor = result.rows[0]; // store the actor's information

        // (2) get character and show information
        const showsResult = await pool.query(
            'SELECT ts.show_id, ts.name, c.name as character_name FROM tv_show ts INNER JOIN characters c ON ts.show_id = c.show_id WHERE c.actor_id = $1 ORDER BY ts.name', [actorId]
        );

        const showData: ActorShow[] = convertActorShows(showsResult);

        const responseData: ActorShowEndpointReponse = {
            actor: actor.name,
            count: showData.length,
            shows: showData
        };

        response.json(responseData);

    } catch (error) {
        response.status(500).json({error: 'Internal server error' + error});
    }
};
