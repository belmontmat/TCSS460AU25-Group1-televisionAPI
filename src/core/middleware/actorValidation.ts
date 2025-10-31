import { Request, Response, NextFunction } from 'express';
import { query, param, validationResult } from 'express-validator';

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

/**
 * Validates actor query parameters
 */
export const validateActorQueries = [
    query('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name parameter cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Name parameter too long (max 100 characters)'),
    handleValidationErrors
];

/**
 * Validates actor ID parameter
 */
export const validateActorId = [
    param('id')
        .notEmpty()
        .withMessage('ID is required')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer')
        .toInt(),
    handleValidationErrors
];

/**
 * Validates actor rating count query parameter
 */
export const validateActorRatingCount = [
    query('count')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Count must be between 1 and 50 inclusive')
        .toInt(),
    handleValidationErrors
];