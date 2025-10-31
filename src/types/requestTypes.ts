/**
 * Request type definitions for query parameters
 * These types reflect the structure after express-validator processing
 */

/**
 * Pagination query parameters
 * Used by endpoints that support pagination
 */
export interface PaginationQuery {
    page?: number;
    limit?: number;
}

/**
 * Count query parameter
 * Used by endpoints that accept a count/limit parameter
 */
export interface CountQuery {
    count?: number;
}

/**
 * Limit query parameter
 * Used by top-list endpoints (popular, top-rated, etc.)
 */
export interface LimitQuery {
    limit?: number;
}

/**
 * Filter query parameters
 * Used by the /filter endpoint for advanced show filtering
 * After validation, numeric and date fields are properly typed
 * startDate and endDate will always have default values after validation
 */
export interface FilterQuery extends PaginationQuery {
    actors?: string;
    genres?: string;
    network?: string;
    studios?: string;
    status?: string;
    minRating?: number;
    maxRating?: number;
    startDate: string;  // Always has default value '1900-01-01'
    endDate: string;    // Always has default value (today's date)
    country?: string;
    creators?: string;
    name?: string;
}