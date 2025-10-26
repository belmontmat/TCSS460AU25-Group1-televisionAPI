import { Request, Response } from 'express';
import { getPool } from '@/core/utilities/database';

export const createActor = async(request: Request, response: Response) => {
    try {
        const { name, profile_url } = request.body;

        const pool = getPool();

        // Check if actor already exists
        const existingActor = await pool.query(
            'SELECT actor_id FROM actors WHERE name = $1',
            [name]
        );

        if (existingActor.rows.length > 0) {
            response.status(400).json({ 
                error: 'Actor already exists',
                details: 'An actor with this name already exists in the database',
                existingID: existingActor.rows[0].actor_id
            });
            return;
        }
         // Insert new actor
        const result = await pool.query(
            'INSERT INTO actors (name, profile_url) VALUES ($1, $2) RETURNING actor_id, name, profile_url',
            [name, profile_url || null]
        );

        const newActor = result.rows[0];

        response.status(201).json({
            actor_id: newActor.actor_id,
            name: newActor.name,
            profile_url: newActor.profile_url
        });
    } catch (error) {
        console.error('Error creating actor:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};
