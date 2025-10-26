import { Request, Response } from 'express';
import { getPool } from '@/core/utilities/database';

export const deleteShow = async (request: Request, response: Response) => {
    try {
        const showId = parseInt(request.params.id as string);

        const pool = getPool();

        // Check if show exists
        const showExists = await pool.query(
            'SELECT show_id FROM tv_show WHERE show_id = $1',
            [showId]
        );

        if (showExists.rows.length === 0) {
            response.status(404).json({ 
                error: 'Resource not found',
                details: 'Show with the specified ID does not exist' 
            });
            return;
        }

        // DELETE the show (cascade will handle related records)
        await pool.query(
            'DELETE FROM tv_show WHERE show_id = $1',
            [showId]
        );

        // Return 204 No Content on successful deletion
        response.status(204).send();
    } catch (error) {
        console.error('Error deleting show:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};