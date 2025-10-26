import { Request, Response, NextFunction } from 'express';

export const validateActorCreate = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { name, profile_url } = request.body;
    const MAX_NAME_LENGTH = 250;
    const MAX_URL_LENGTH = 500;

    // Validate required field: name
    if (!name) {
        response.status(400).json({ 
            error: 'Name is required',
            details: 'Actor name must be provided' 
        });
        return;
    }

    // Validate name is a string
    if (typeof name !== 'string') {
        response.status(400).json({ 
            error: 'Invalid name format',
            details: 'Name must be a string' 
        });
        return;
    }

    // Validate name is not empty or only whitespace
    if (name.trim() === '') {
        response.status(400).json({ 
            error: 'Name cannot be empty',
            details: 'Actor name must contain non-whitespace characters' 
        });
        return;
    }

    // Validate name length
    if (name.length > MAX_NAME_LENGTH) {
        response.status(400).json({ 
            error: 'Name too long',
            details: `Actor name must be ${MAX_NAME_LENGTH} characters or less`
        });
        return;
    }

    // Validate profile_url if provided (optional field)
    if (profile_url !== undefined && profile_url !== null) {
        if (typeof profile_url !== 'string') {
            response.status(400).json({ 
                error: 'Invalid profile_url format',
                details: 'Profile URL must be a string' 
            });
            return;
        }

        if (profile_url.trim() !== '') {
            // Basic URL validation
            try {
                new URL(profile_url);
            } catch (error) {
                response.status(400).json({ 
                    error: 'Invalid profile_url',
                    details: 'Profile URL must be a valid URL format - ' + error 
                });
                return;
            }

            // Validate URL length
            if (profile_url.length > MAX_URL_LENGTH) {
                response.status(400).json({ 
                    error: 'Profile URL too long',
                    details: `Profile URL must be ${MAX_URL_LENGTH} characters or less`
                });
                return;
            }
        }
    }

    // Sanitize and normalize the data - remove white space
    request.body.name = name.trim();
    if (profile_url && typeof profile_url === 'string') {
        request.body.profile_url = profile_url.trim();
    }

    next();
};