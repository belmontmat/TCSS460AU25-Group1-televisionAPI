// validationUtils.ts
import { Response } from 'express';

export interface ValidationError {
    success: boolean;
    error: string;
    details: string;
}

/**
 * Validates that a field exists and is not undefined/null
 */
export const validateRequired = (
    value: any,
    fieldName: string
): ValidationError | null => {
    if (value === undefined || value === null) {
        return {
            success: false,
            error: `${fieldName} is required`,
            details: `${fieldName} must be provided`
        };
    }
    return null;
};

/**
 * Validates that a value is a string
 */
export const validateString = (
    value: any,
    fieldName: string
): ValidationError | null => {
    if (typeof value !== 'string') {
        return {
            success: false,
            error: `Invalid ${fieldName} format`,
            details: `${fieldName} must be a string`
        };
    }
    return null;
};

/**
 * Validates that a string is not empty or only whitespace
 */
export const validateNotEmpty = (
    value: string,
    fieldName: string
): ValidationError | null => {
    if (value.trim() === '') {
        return {
            success: false,
            error: `${fieldName} cannot be empty`,
            details: `${fieldName} must contain non-whitespace characters`
        };
    }
    return null;
};

/**
 * Validates that a string does not exceed maximum length
 */
export const validateMaxLength = (
    value: string,
    maxLength: number,
    fieldName: string
): ValidationError | null => {
    if (value.length > maxLength) {
        return {
            success: false,
            error: `${fieldName} too long`,
            details: `${fieldName} must be ${maxLength} characters or less`
        };
    }
    return null;
};

/**
 * Validates that a string is a valid URL
 */
export const validateUrl = (
    value: string,
    fieldName: string
): ValidationError | null => {
    try {
        new URL(value);
        return null;
    } catch (error) {
        return {
            success: false,
            error: `Invalid ${fieldName}`,
            details: `${fieldName} must be a valid URL format - ${error}`
        };
    }
};

/**
 * Helper function to send validation error response
 */
export const sendValidationError = (
    response: Response,
    error: ValidationError
): void => {
    response.status(400).json(error);
};

/**
 * Runs multiple validators and returns the first error found
 */
export const runValidators = (
    validators: (() => ValidationError | null)[]
): ValidationError | null => {
    for (const validator of validators) {
        const error = validator();
        if (error) {
            return error;
        }
    }
    return null;
};

/**
 * Validates an optional field (only validates if field exists and is not empty)
 */
export const validateOptionalField = (
    value: any,
    fieldName: string,
    validators: ((val: any) => ValidationError | null)[]
): ValidationError | null => {
    // Skip validation if field is undefined, null, or empty string
    if (value === undefined || value === null) {
        return null;
    }

    // If value exists, run all validators
    for (const validator of validators) {
        const error = validator(value);
        if (error) {
            return error;
        }
    }
    return null;
};

/**
 * Sanitizes string by trimming whitespace
 */
export const sanitizeString = (value: string): string => {
    return value.trim();
};

/**
 * Validates that a value is a valid integer
 */
export const validateInteger = (
    value: any,
    fieldName: string
): ValidationError | null => {
    if (!Number.isInteger(value)) {
        return {
            success: false,
            error: `Invalid ${fieldName} format`,
            details: `${fieldName} must be an integer`
        };
    }
    return null;
};

/**
 * Validates that a number is within a minimum value
 */
export const validateMin = (
    value: number,
    min: number,
    fieldName: string
): ValidationError | null => {
    if (value < min) {
        return {
            success: false,
            error: `${fieldName} too small`,
            details: `${fieldName} must be at least ${min}`
        };
    }
    return null;
};

/**
 * Validates that a value is a valid date string (ISO format or parseable)
 */
export const validateDate = (
    value: string,
    fieldName: string
): ValidationError | null => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return {
            success: false,
            error: `Invalid ${fieldName}`,
            details: `${fieldName} must be a valid date format`
        };
    }
    return null;
};

/**
 * Validates that a value is an array
 */
export const validateArray = (
    value: any,
    fieldName: string
): ValidationError | null => {
    if (!Array.isArray(value)) {
        return {
            success: false,
            error: `Invalid ${fieldName} format`,
            details: `${fieldName} must be an array`
        };
    }
    return null;
};

/**
 * Validates that an array contains only integers
 */
export const validateIntegerArray = (
    value: any[],
    fieldName: string
): ValidationError | null => {
    if (!value.every((item) => Number.isInteger(item))) {
        return {
            success: false,
            error: `Invalid ${fieldName} format`,
            details: `${fieldName} must contain only integers`
        };
    }
    return null;
};

/**
 * Validates that a value is one of the allowed enum values
 */
export const validateEnum = <T>(
    value: any,
    allowedValues: T[],
    fieldName: string
): ValidationError | null => {
    if (!allowedValues.includes(value)) {
        return {
            success: false,
            error: `Invalid ${fieldName}`,
            details: `${fieldName} must be one of: ${allowedValues.join(', ')}`
        };
    }
    return null;
};

/**
 * Validates that an array is not empty
 */
export const validateNotEmptyArray = (
    value: any[],
    fieldName: string
): ValidationError | null => {
    if (value.length === 0) {
        return {
            success: false,
            error: `${fieldName} cannot be empty`,
            details: `${fieldName} must contain at least one item`
        };
    }
    return null;
};

/**
 * Validates that a value is a valid number (float)
 */
export const validateNumber = (
    value: any,
    fieldName: string
): ValidationError | null => {
    if (typeof value !== 'number' || isNaN(value)) {
        return {
            success: false,
            error: `Invalid ${fieldName} format`,
            details: `${fieldName} must be a number`
        };
    }
    return null;
};

/**
 * Parses a semicolon-separated string into an array and trims each value
 */
export const parseSemicolonArray = (value: string): string[] => {
    return value.split(';').map(item => item.trim()).filter(item => item !== '');
};

/**
 * Validates that a string array contains valid values
 */
export const validateStringArray = (
    value: any[],
    fieldName: string
): ValidationError | null => {
    if (!value.every((item) => typeof item === 'string' && item.trim() !== '')) {
        return {
            success: false,
            error: `Invalid ${fieldName} format`,
            details: `${fieldName} must contain only non-empty strings`
        };
    }
    return null;
};