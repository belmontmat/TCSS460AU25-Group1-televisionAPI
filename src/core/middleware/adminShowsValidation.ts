import { Request, Response, NextFunction } from 'express';
import {
    validateRequired,
    validateString,
    validateNotEmpty,
    validateMaxLength,
    validateUrl,
    validateInteger,
    validateNumber,
    validateMin,
    validateDate,
    validateArray,
    validateIntegerArray,
    validateStringArray,
    validateEnum,
    validateOptionalField,
    sendValidationError,
    runValidators,
    sanitizeString,
    parseSemicolonArray
} from '@/core/utilities/validate';

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

export const validateShowCreate = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {
        name,
        original_name,
        first_air_date,
        last_air_date,
        seasons,
        episodes,
        status,
        overview,
        popularity,
        tmdb_rating,
        vote_count,
        poster_url,
        backdrop_url,
        genres,
        network,
        network_country,
        companies,
        creators
    } = request.body;

    // Validate required name field
    const nameError = runValidators([
        () => validateRequired(name, 'Name'),
        () => validateString(name, 'Name'),
        () => validateNotEmpty(name, 'Name'),
        () => validateMaxLength(name, MAX_NAME_LENGTH, 'Name')
    ]);

    if (nameError) {
        sendValidationError(response, nameError);
        return;
    }

    // Validate optional original_name field
    const originalNameError = validateOptionalField(
        original_name,
        'Original Name',
        [
            (val) => validateString(val, 'Original Name'),
            (val) => validateNotEmpty(val, 'Original Name'),
            (val) => validateMaxLength(val, MAX_NAME_LENGTH, 'Original Name')
        ]
    );

    if (originalNameError) {
        sendValidationError(response, originalNameError);
        return;
    }

    // Validate optional first_air_date field
    const firstAirDateError = validateOptionalField(
        first_air_date,
        'First Air Date',
        [
            (val) => validateString(val, 'First Air Date'),
            (val) => validateDate(val, 'First Air Date')
        ]
    );

    if (firstAirDateError) {
        sendValidationError(response, firstAirDateError);
        return;
    }

    // Validate optional last_air_date field
    const lastAirDateError = validateOptionalField(
        last_air_date,
        'Last Air Date',
        [
            (val) => validateString(val, 'Last Air Date'),
            (val) => validateDate(val, 'Last Air Date')
        ]
    );

    if (lastAirDateError) {
        sendValidationError(response, lastAirDateError);
        return;
    }

    // Validate optional seasons field
    const seasonsError = validateOptionalField(
        seasons,
        'Seasons',
        [
            (val) => validateInteger(val, 'Seasons'),
            (val) => validateMin(val, 0, 'Seasons')
        ]
    );

    if (seasonsError) {
        sendValidationError(response, seasonsError);
        return;
    }

    // Validate optional episodes field
    const episodesError = validateOptionalField(
        episodes,
        'Episodes',
        [
            (val) => validateInteger(val, 'Episodes'),
            (val) => validateMin(val, 0, 'Episodes')
        ]
    );

    if (episodesError) {
        sendValidationError(response, episodesError);
        return;
    }

    // Validate optional status field
    const statusError = validateOptionalField(
        status,
        'Status',
        [
            (val) => validateString(val, 'Status'),
            (val) => validateEnum(val, VALID_STATUSES, 'Status')
        ]
    );

    if (statusError) {
        sendValidationError(response, statusError);
        return;
    }

    // Validate optional overview field
    const overviewError = validateOptionalField(
        overview,
        'Overview',
        [
            (val) => validateString(val, 'Overview'),
            (val) => validateMaxLength(val, MAX_OVERVIEW_LENGTH, 'Overview')
        ]
    );

    if (overviewError) {
        sendValidationError(response, overviewError);
        return;
    }

    // Validate optional popularity field
    const popularityError = validateOptionalField(
        popularity,
        'Popularity',
        [
            (val) => validateNumber(val, 'Popularity'),
            (val) => validateMin(val, 0, 'Popularity')
        ]
    );

    if (popularityError) {
        sendValidationError(response, popularityError);
        return;
    }

    // Validate optional tmdb_rating field
    const tmdbRatingError = validateOptionalField(
        tmdb_rating,
        'TMDb Rating',
        [
            (val) => validateNumber(val, 'TMDb Rating'),
            (val) => validateMin(val, 0, 'TMDb Rating')
        ]
    );

    if (tmdbRatingError) {
        sendValidationError(response, tmdbRatingError);
        return;
    }

    // Validate optional vote_count field
    const voteCountError = validateOptionalField(
        vote_count,
        'Vote Count',
        [
            (val) => validateInteger(val, 'Vote Count'),
            (val) => validateMin(val, 0, 'Vote Count')
        ]
    );

    if (voteCountError) {
        sendValidationError(response, voteCountError);
        return;
    }

    // Validate optional poster_url field
    const posterUrlError = validateOptionalField(
        poster_url,
        'Poster URL',
        [
            (val) => validateString(val, 'Poster URL'),
            (val) => val.trim() !== '' ? validateUrl(val, 'Poster URL') : null,
            (val) => validateMaxLength(val, MAX_URL_LENGTH, 'Poster URL')
        ]
    );

    if (posterUrlError) {
        sendValidationError(response, posterUrlError);
        return;
    }

    // Validate optional backdrop_url field
    const backdropUrlError = validateOptionalField(
        backdrop_url,
        'Backdrop URL',
        [
            (val) => validateString(val, 'Backdrop URL'),
            (val) => val.trim() !== '' ? validateUrl(val, 'Backdrop URL') : null,
            (val) => validateMaxLength(val, MAX_URL_LENGTH, 'Backdrop URL')
        ]
    );

    if (backdropUrlError) {
        sendValidationError(response, backdropUrlError);
        return;
    }

    // Handle genres - can be array of integers OR semicolon-separated string
    if (genres !== undefined && genres !== null) {
        if (typeof genres === 'string') {
            // Parse semicolon-separated string into array
            request.body.genres = parseSemicolonArray(genres);
        } else {
            // Validate as array
            const genresError = validateOptionalField(
                genres,
                'Genres',
                [
                    (val) => validateArray(val, 'Genres'),
                    (val) => Array.isArray(val) && val.every(item => typeof item === 'number') 
                        ? validateIntegerArray(val, 'Genres') 
                        : validateStringArray(val, 'Genres')
                ]
            );

            if (genresError) {
                sendValidationError(response, genresError);
                return;
            }
        }
    }

    // Handle network - can be integer ID OR string name
    if (network !== undefined && network !== null) {
        if (typeof network === 'string') {
            request.body.network = sanitizeString(network);
        } else {
            const networkError = validateOptionalField(
                network,
                'Network',
                [
                    (val) => validateInteger(val, 'Network')
                ]
            );

            if (networkError) {
                sendValidationError(response, networkError);
                return;
            }
        }
    }

    // Validate optional network_country field
    const networkCountryError = validateOptionalField(
        network_country,
        'Network Country',
        [
            (val) => validateString(val, 'Network Country'),
            (val) => validateNotEmpty(val, 'Network Country'),
            (val) => validateMaxLength(val, MAX_COUNTRY_LENGTH, 'Network Country')
        ]
    );

    if (networkCountryError) {
        sendValidationError(response, networkCountryError);
        return;
    }

    // Handle companies - can be array of integers OR semicolon-separated string
    if (companies !== undefined && companies !== null) {
        if (typeof companies === 'string') {
            // Parse semicolon-separated string into array
            request.body.companies = parseSemicolonArray(companies);
        } else {
            const companiesError = validateOptionalField(
                companies,
                'Companies',
                [
                    (val) => validateArray(val, 'Companies'),
                    (val) => Array.isArray(val) && val.every(item => typeof item === 'number')
                        ? validateIntegerArray(val, 'Companies')
                        : validateStringArray(val, 'Companies')
                ]
            );

            if (companiesError) {
                sendValidationError(response, companiesError);
                return;
            }
        }
    }

    // Validate optional creators field (string)
    const creatorsError = validateOptionalField(
        creators,
        'Creators',
        [
            (val) => validateString(val, 'Creators'),
            (val) => validateMaxLength(val, MAX_CREATORS_LENGTH, 'Creators')
        ]
    );

    if (creatorsError) {
        sendValidationError(response, creatorsError);
        return;
    }

    // Sanitize and normalize string data - remove white space
    request.body.name = sanitizeString(name);
    if (original_name && typeof original_name === 'string') {
        request.body.original_name = sanitizeString(original_name);
    }
    if (overview && typeof overview === 'string') {
        request.body.overview = sanitizeString(overview);
    }
    if (poster_url && typeof poster_url === 'string') {
        request.body.poster_url = sanitizeString(poster_url);
    }
    if (backdrop_url && typeof backdrop_url === 'string') {
        request.body.backdrop_url = sanitizeString(backdrop_url);
    }
    if (network_country && typeof network_country === 'string') {
        request.body.network_country = sanitizeString(network_country);
    }
    if (creators && typeof creators === 'string') {
        request.body.creators = sanitizeString(creators);
    }

    next();
};