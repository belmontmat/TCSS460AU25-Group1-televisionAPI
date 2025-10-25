import { Request, Response } from 'express';
import { getPool } from '@/core/utilities/database';
import { QueryResult } from 'pg';
import { ActorsSummary } from '@/types/responseTypes';

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

        const summaries: ActorsSummary[] = result.rows.map(show => ({
            actor_id: show.actor_id,
            name: show.name,
            profile_url: show.profile_url
        }));

        response.json({
            count: totalCount,
            page: page,
            data: summaries
        });
    } catch (error) {
        response.status(500).json({error: 'Internal server error' + error});
    }
};
