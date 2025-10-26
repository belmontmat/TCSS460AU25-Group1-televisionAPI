import { Request, Response, NextFunction } from 'express';

export const validateId = (
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