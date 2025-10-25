import { Request, Response, NextFunction } from 'express';

export const validateActorQueries = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const nameQuery = request.query.name as string | undefined;

    // Validate name query
    if (nameQuery !== undefined) {
        // Check if empty or only whitespace
        if (nameQuery.trim() === '') {
            response.status(400).json({ error: 'Name parameter cannot be empty' });
        }
        // Check length (prevent extremely long queries)
        if (nameQuery.length > 100) {
            response.status(400).json({ error: 'Name parameter too long (max 100 characters)' });
        }
    }

    next();
};