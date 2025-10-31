import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

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
const MAX_OVERVIEW_LENGTH = 2000;
const MAX_CREATORS_LENGTH = 500;
const MAX_COUNTRY_LENGTH = 100;

const VALID_STATUSES = [
    'Returning Series',
    'Planned',
    'In Production',
    'Ended',
    'Canceled',
    'Pilot'
];

/**
 * Custom sanitizer to parse semicolon-separated strings into arrays
 */
const parseSemicolonArray = (value: any): any => {
    if (typeof value === 'string') {
        return value.split(';').map(item => item.trim()).filter(item => item !== '');
    }
    return value;
};

/**
 * Validates show creation request
 */
export const validateShowCreate = [
    // Required name field
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: MAX_NAME_LENGTH })
        .withMessage(`Name must be between 1 and ${MAX_NAME_LENGTH} characters`),
    
    // Optional original_name
    body('original_name')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Original Name cannot be empty if provided')
        .isLength({ max: MAX_NAME_LENGTH })
        .withMessage(`Original Name must be ${MAX_NAME_LENGTH} characters or less`),
    
    // Optional first_air_date
    body('first_air_date')
        .optional({ values: 'falsy' })
        .trim()
        .isISO8601()
        .withMessage('First Air Date must be a valid date'),
    
    // Optional last_air_date
    body('last_air_date')
        .optional({ values: 'falsy' })
        .trim()
        .isISO8601()
        .withMessage('Last Air Date must be a valid date'),
    
    // Optional seasons
    body('seasons')
        .optional({ values: 'falsy' })
        .isInt({ min: 0 })
        .withMessage('Seasons must be an integer of 0 or greater')
        .toInt(),
    
    // Optional episodes
    body('episodes')
        .optional({ values: 'falsy' })
        .isInt({ min: 0 })
        .withMessage('Episodes must be an integer of 0 or greater')
        .toInt(),
    
    // Optional status
    body('status')
        .optional({ values: 'falsy' })
        .trim()
        .isIn(VALID_STATUSES)
        .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
    
    // Optional overview
    body('overview')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: MAX_OVERVIEW_LENGTH })
        .withMessage(`Overview must be ${MAX_OVERVIEW_LENGTH} characters or less`),
    
    // Optional popularity
    body('popularity')
        .optional({ values: 'falsy' })
        .isFloat({ min: 0 })
        .withMessage('Popularity must be a number of 0 or greater')
        .toFloat(),
    
    // Optional tmdb_rating
    body('tmdb_rating')
        .optional({ values: 'falsy' })
        .isFloat({ min: 0 })
        .withMessage('TMDb Rating must be a number of 0 or greater')
        .toFloat(),
    
    // Optional vote_count
    body('vote_count')
        .optional({ values: 'falsy' })
        .isInt({ min: 0 })
        .withMessage('Vote Count must be an integer of 0 or greater')
        .toInt(),
    
    // Optional poster_url
    body('poster_url')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Poster URL cannot be empty if provided')
        .isURL()
        .withMessage('Poster URL must be a valid URL')
        .isLength({ max: MAX_URL_LENGTH })
        .withMessage(`Poster URL must be ${MAX_URL_LENGTH} characters or less`),
    
    // Optional backdrop_url
    body('backdrop_url')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Backdrop URL cannot be empty if provided')
        .isURL()
        .withMessage('Backdrop URL must be a valid URL')
        .isLength({ max: MAX_URL_LENGTH })
        .withMessage(`Backdrop URL must be ${MAX_URL_LENGTH} characters or less`),
    
    // Optional genres - can be array or semicolon-separated string
    body('genres')
        .optional({ values: 'falsy' })
        .customSanitizer(parseSemicolonArray)
        .isArray()
        .withMessage('Genres must be an array or semicolon-separated string'),
    
    body('genres.*')
        .optional()
        .custom((value) => {
            // Allow integers or non-empty strings
            if (Number.isInteger(value) || (typeof value === 'string' && value.trim() !== '')) {
                return true;
            }
            throw new Error('Each genre must be an integer or non-empty string');
        }),
    
    // Optional network - can be integer or string
    body('network')
        .optional({ values: 'falsy' })
        .custom((value) => {
            if (typeof value === 'string') {
                return value.trim() !== '';
            }
            return Number.isInteger(value);
        })
        .withMessage('Network must be an integer ID or non-empty string'),
    
    // Optional network_country
    body('network_country')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Network Country cannot be empty if provided')
        .isLength({ max: MAX_COUNTRY_LENGTH })
        .withMessage(`Network Country must be ${MAX_COUNTRY_LENGTH} characters or less`),
    
    // Optional companies - can be array or semicolon-separated string
    body('companies')
        .optional({ values: 'falsy' })
        .customSanitizer(parseSemicolonArray)
        .isArray()
        .withMessage('Companies must be an array or semicolon-separated string'),
    
    body('companies.*')
        .optional()
        .custom((value) => {
            // Allow integers or non-empty strings
            if (Number.isInteger(value) || (typeof value === 'string' && value.trim() !== '')) {
                return true;
            }
            throw new Error('Each company must be an integer or non-empty string');
        }),
    
    // Optional creators
    body('creators')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: MAX_CREATORS_LENGTH })
        .withMessage(`Creators must be ${MAX_CREATORS_LENGTH} characters or less`),
    
    handleValidationErrors
];

/**
 * Validates show ID parameter
 */
export const validateShowId = [
    param('id')
        .notEmpty()
        .withMessage('Show ID is required')
        .isInt({ min: 1 })
        .withMessage('Show ID must be a positive integer')
        .toInt(),
    handleValidationErrors
];

/**
 * Validates show update request
 * Similar to create but all fields are optional
 */
export const validateShowUpdate = [
    // Optional name field
    body('name')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty if provided')
        .isLength({ min: 1, max: MAX_NAME_LENGTH })
        .withMessage(`Name must be between 1 and ${MAX_NAME_LENGTH} characters`),
    
    // Optional original_name
    body('original_name')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Original Name cannot be empty if provided')
        .isLength({ max: MAX_NAME_LENGTH })
        .withMessage(`Original Name must be ${MAX_NAME_LENGTH} characters or less`),
    
    // Optional first_air_date
    body('first_air_date')
        .optional({ values: 'falsy' })
        .trim()
        .isISO8601()
        .withMessage('First Air Date must be a valid date'),
    
    // Optional last_air_date
    body('last_air_date')
        .optional({ values: 'falsy' })
        .trim()
        .isISO8601()
        .withMessage('Last Air Date must be a valid date'),
    
    // Optional seasons
    body('seasons')
        .optional({ values: 'falsy' })
        .isInt({ min: 0 })
        .withMessage('Seasons must be an integer of 0 or greater')
        .toInt(),
    
    // Optional episodes
    body('episodes')
        .optional({ values: 'falsy' })
        .isInt({ min: 0 })
        .withMessage('Episodes must be an integer of 0 or greater')
        .toInt(),
    
    // Optional status
    body('status')
        .optional({ values: 'falsy' })
        .trim()
        .isIn(VALID_STATUSES)
        .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
    
    // Optional overview
    body('overview')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: MAX_OVERVIEW_LENGTH })
        .withMessage(`Overview must be ${MAX_OVERVIEW_LENGTH} characters or less`),
    
    // Optional popularity
    body('popularity')
        .optional({ values: 'falsy' })
        .isFloat({ min: 0 })
        .withMessage('Popularity must be a number of 0 or greater')
        .toFloat(),
    
    // Optional tmdb_rating
    body('tmdb_rating')
        .optional({ values: 'falsy' })
        .isFloat({ min: 0 })
        .withMessage('TMDb Rating must be a number of 0 or greater')
        .toFloat(),
    
    // Optional vote_count
    body('vote_count')
        .optional({ values: 'falsy' })
        .isInt({ min: 0 })
        .withMessage('Vote Count must be an integer of 0 or greater')
        .toInt(),
    
    // Optional poster_url
    body('poster_url')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Poster URL cannot be empty if provided')
        .isURL()
        .withMessage('Poster URL must be a valid URL')
        .isLength({ max: MAX_URL_LENGTH })
        .withMessage(`Poster URL must be ${MAX_URL_LENGTH} characters or less`),
    
    // Optional backdrop_url
    body('backdrop_url')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Backdrop URL cannot be empty if provided')
        .isURL()
        .withMessage('Backdrop URL must be a valid URL')
        .isLength({ max: MAX_URL_LENGTH })
        .withMessage(`Backdrop URL must be ${MAX_URL_LENGTH} characters or less`),
    
    // Optional genres - can be array or semicolon-separated string
    body('genres')
        .optional({ values: 'falsy' })
        .customSanitizer(parseSemicolonArray)
        .isArray()
        .withMessage('Genres must be an array or semicolon-separated string'),
    
    body('genres.*')
        .optional()
        .custom((value) => {
            // Allow integers or non-empty strings
            if (Number.isInteger(value) || (typeof value === 'string' && value.trim() !== '')) {
                return true;
            }
            throw new Error('Each genre must be an integer or non-empty string');
        }),
    
    // Optional network - can be integer or string
    body('network')
        .optional({ values: 'falsy' })
        .custom((value) => {
            if (typeof value === 'string') {
                return value.trim() !== '';
            }
            return Number.isInteger(value);
        })
        .withMessage('Network must be an integer ID or non-empty string'),
    
    // Optional network_country
    body('network_country')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Network Country cannot be empty if provided')
        .isLength({ max: MAX_COUNTRY_LENGTH })
        .withMessage(`Network Country must be ${MAX_COUNTRY_LENGTH} characters or less`),
    
    // Optional companies - can be array or semicolon-separated string
    body('companies')
        .optional({ values: 'falsy' })
        .customSanitizer(parseSemicolonArray)
        .isArray()
        .withMessage('Companies must be an array or semicolon-separated string'),
    
    body('companies.*')
        .optional()
        .custom((value) => {
            // Allow integers or non-empty strings
            if (Number.isInteger(value) || (typeof value === 'string' && value.trim() !== '')) {
                return true;
            }
            throw new Error('Each company must be an integer or non-empty string');
        }),
    
    // Optional creators
    body('creators')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: MAX_CREATORS_LENGTH })
        .withMessage(`Creators must be ${MAX_CREATORS_LENGTH} characters or less`),
    
    handleValidationErrors
];