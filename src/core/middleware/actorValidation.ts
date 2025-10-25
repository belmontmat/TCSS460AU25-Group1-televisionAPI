import { Request, Response, NextFunction } from 'express';

export const validateActorQueries = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    const nameQuery = request.query.name as string | undefined;
    
    // Validate name query
    if (nameQuery !== undefined) {
        // Check if empty or only whitespace
        if (nameQuery.trim() === '') {
            response.status(400).json({ error: 'Name parameter cannot be empty' });
            return;
        }
        // Check length (prevent extremely long queries)
        if (nameQuery.length > 100) {
            response.status(400).json({ error: 'Name parameter too long (max 100 characters)' });
            return;
        }
    }

    next();
};

export const validateActorId = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    const idPattern = /^\d+$/;
    // check for bad params
    if (!request.params.id || !idPattern.test(request.params.id)) {
        response.status(400).json({
            error: 'Invalid ID format.',
            details: 'ID must be numeric and not empty.'
        });
        return;
    }
    next();
};
