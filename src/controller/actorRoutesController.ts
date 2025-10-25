import { Request, Response } from 'express';
import { getPool } from '@/core/utilities/database';
import { QueryResult } from 'pg';
import { ActorsSummary } from '@/types/responseTypes';
import { convertActorsSummary } from '@/core/utilities/convertActors';

export const getAllActors = async (request: Request, response: Response) => {
    try {
        const page = Math.max(parseInt(request.query.page as string), 1) || 1;
        const limit = Math.min(parseInt(request.query.limit as string), 100) || 50;
        const offset = (page - 1) * limit;

        const pool = getPool();

        const countResult = await pool.query('SELECT COUNT(*) FROM actors');
        const totalCount = parseInt(countResult.rows[0].count);

        const result: QueryResult<ActorsSummary> = await pool.query(
            'SELECT * FROM actors LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const summaries: ActorsSummary[] = convertActorsSummary(result);

        response.json({
            count: totalCount,
            page: page,
            data: summaries
        });
    } catch (error) {
        response.status(500).json({error: 'Internal server error' + error});
    }
};

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

                response.json({
                    summaries
                });
            }
        }


    } catch (error) {
        response.status(500).json({error: 'Internal server error' + error});
    }
};
