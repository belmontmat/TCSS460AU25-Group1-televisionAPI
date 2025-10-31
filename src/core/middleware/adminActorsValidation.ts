import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (request: Request, response: Response, next: NextFunction): void => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.type === 'field' ? err.path : undefined,
                message: err.msg
            }))
        });
        return;
    }
    next();
};

const MAX_NAME_LENGTH = 250;
const MAX_URL_LENGTH = 500;

/**
 * Validates actor creation request
 */
export const validateActorCreate = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: MAX_NAME_LENGTH })
        .withMessage(`Name must be between 1 and ${MAX_NAME_LENGTH} characters`),
    
    body('profile_url')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Profile URL cannot be empty if provided')
        .isURL()
        .withMessage('Profile URL must be a valid URL')
        .isLength({ max: MAX_URL_LENGTH })
        .withMessage(`Profile URL must be ${MAX_URL_LENGTH} characters or less`),
    
    handleValidationErrors
];