import { Request, Response } from 'express';
import { getPool } from '@/core/utilities/database';
import { QueryResult } from 'pg';
import { ActorsSummary } from '@/types/responseTypes';
import { convertActorsSummary } from '@/core/utilities/convertActors';

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
        const idPattern = /^\d+$/;
        // check for bad params
        if (!request.params.id || !idPattern.test(request.params.id)) {
            response.status(400).json({
                error: 'Invalid ID format.',
                details: 'ID must be numeric and not empty.'
            });
        } else {

            const pool = getPool();
            const result: QueryResult<ActorsSummary> = await pool.query(
                'SELECT actor_id, name, profile_url FROM actors WHERE actor_id=$1',
                [request.params.id]
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
        }


    } catch (error) {
        response.status(500).json({error: 'Internal server error' + error});
    }
};
