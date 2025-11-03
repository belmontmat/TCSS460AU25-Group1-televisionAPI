/**
 * Validation middleware for show routes
 */

import { query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (request: Request, response: Response, next: NextFunction): void => {
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
 * Pagination validation
 */
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100')
        .toInt()
];

/**
 * Validate show ID parameter
 */
export const validateShowId = [
    param('id')
        .notEmpty()
        .withMessage('ID is required')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer')
        .toInt(),
    handleValidationErrors
];

/**
 * Validate count parameter (for random shows)
 */
export const validateCount = [
    query('count')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Count must be an integer between 1 and 100')
        .toInt()
        .default(10),
    handleValidationErrors
];

/**
 * Validate limit parameter (for top lists)
 */
export const validateLimit = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100')
        .toInt()
        .default(50),
    handleValidationErrors
];

/**
 * Validate filter parameters
 */
export const validateFilter = [
    query('actors')
        .optional()
        .trim()
        .isString()
        .withMessage('Actors must be a comma-separated string'),
    query('genres')
        .optional()
        .trim()
        .isString()
        .withMessage('Genres must be a comma-separated string'),
    query('network')
        .optional()
        .trim()
        .isString()
        .withMessage('Network must be a string'),
    query('studios')
        .optional()
        .trim()
        .isString()
        .withMessage('Studios must be a comma-separated string'),
    query('status')
        .optional()
        .trim()
        .isString()
        .withMessage('Status must be a string'),
    query('min_rating')
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage('Min rating must be a number between 0 and 10')
        .toFloat()
        .default(0),
    query('max_rating')
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage('Max rating must be a number between 0 and 10')
        .toFloat()
        .default(10),
    query('startDate')
        .default('1900-01-01')
        .isISO8601()
        .withMessage('Start date must be a valid ISO date'),
    query('endDate')
        .customSanitizer((value) => value || new Date().toISOString().split('T')[0])
        .isISO8601()
        .withMessage('End date must be a valid ISO date'),
    query('country')
        .optional()
        .trim()
        .isString()
        .withMessage('Country must be a string'),
    query('creators')
        .optional()
        .trim()
        .isString()
        .withMessage('Creators must be a comma-separated string'),
    query('name')
        .optional()
        .trim()
        .isString()
        .withMessage('Name must be a string'),
    ...validatePagination,
    handleValidationErrors
];