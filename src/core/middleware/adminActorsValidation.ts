import { Request, Response, NextFunction } from 'express';
import {
    validateRequired,
    validateString,
    validateNotEmpty,
    validateMaxLength,
    validateUrl,
    validateOptionalField,
    sendValidationError,
    runValidators,
    sanitizeString
} from '@/core/utilities/validate';

export const validateActorCreate = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { name, profile_url } = request.body;
    const MAX_NAME_LENGTH = 250;
    const MAX_URL_LENGTH = 500;

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

    // Validate optional profile_url field
    const urlError = validateOptionalField(
        profile_url,
        'Profile URL',
        [
            (val) => validateString(val, 'Profile URL'),
            (val) => val.trim() !== '' ? validateUrl(val, 'Profile URL') : null,
            (val) => validateMaxLength(val, MAX_URL_LENGTH, 'Profile URL')
        ]
    );

    if (urlError) {
        sendValidationError(response, urlError);
        return;
    }

    // Sanitize and normalize the data - remove white space
    request.body.name = sanitizeString(name);
    if (profile_url && typeof profile_url === 'string') {
        request.body.profile_url = sanitizeString(profile_url);
    }

    next();
};