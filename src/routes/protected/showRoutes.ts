/**
 * Routes for TV show listings
 */

import { getShowById, getShowList, getRandomShows, getLongestRunning, getPopular, getTopRated, getShowByFilter } from '@/controller/showRoutesController';
import { convertShowDetailsToShowSummary } from '@/core/utilities/convert';
import { Router, Request, Response } from 'express';
import {
    validatePagination,
    validateShowId,
    validateCount,
    validateLimit,
    validateFilter,
    handleValidationErrors
} from '@/core/middleware/showRoutesValidation';
import type { ShowsResponse, ShowsFilterResponse, ShowDetail, ShowSummary } from '@/types/responseTypes';
import type { PaginationQuery, CountQuery, LimitQuery, FilterQuery } from '@/types/requestTypes';
import type { ErrorResponse } from '@/types/errorTypes';

const showRoutes = Router();

// GET / - List all shows with pagination
showRoutes.get('/', validatePagination, handleValidationErrors, async (request: Request<{}, {}, {}, PaginationQuery>, response: Response<ShowsResponse | ErrorResponse>) => {
    try {
        const page = request.query.page || 1;
        const limit = request.query.limit || 50;

        const result = await getShowList(page, limit);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({ error: 'Internal server error: ' + error });
    }
});

// GET /filter - Filter shows by multiple criteria
showRoutes.get('/filter', validateFilter, async (request: Request<{}, {}, {}, FilterQuery>, response: Response<ShowsFilterResponse | ErrorResponse>) => {
    try {
        const actors = request.query.actors || '';
        const genres = request.query.genres || '';
        const network = request.query.network || '';
        const studios = request.query.studios || '';
        const status = request.query.status || '';
        const minRating = request.query.min_rating || 0;
        const maxRating = request.query.max_rating || 10;
        const startDate = request.query.startDate;  // Always has value from validator
        const endDate = request.query.endDate;      // Always has value from validator
        const country = request.query.country || '';
        const creators = request.query.creators || '';
        const name = request.query.name || '';

        const page = request.query.page || 1;
        const limit = request.query.limit || 50;

        const result = await getShowByFilter(
            actors, genres, network, studios, status,
            minRating, maxRating, startDate, endDate,
            country, creators, name, page, limit
        );
        return response.json(result);
    } catch (error) {
        return response.status(500).json({ error: 'Internal server error: ' + error });
    }
});

// GET /random - Get random shows
showRoutes.get('/random', validateCount, async (request: Request<{}, {}, {}, CountQuery>, response: Response<ShowSummary[] | ErrorResponse>) => {
    try {
        const count = request.query.count || 10;
        const result = await getRandomShows(count);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

// GET /longest-running - Get longest running shows
showRoutes.get('/longest-running', validateLimit, async (request: Request<{}, {}, {}, LimitQuery>, response: Response<ShowSummary[] | ErrorResponse>) => {
    try {
        const limit = request.query.limit || 50;
        const result = await getLongestRunning(limit);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

// GET /popular - Get popular shows
showRoutes.get('/popular', validateLimit, async (request: Request<{}, {}, {}, LimitQuery>, response: Response<ShowSummary[] | ErrorResponse>) => {
    try {
        const limit = request.query.limit || 50;
        const result = await getPopular(limit);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

// GET /top-rated - Get top rated shows
showRoutes.get('/top-rated', validateLimit, async (request: Request<{}, {}, {}, LimitQuery>, response: Response<ShowSummary[] | ErrorResponse>) => {
    try {
        const limit = request.query.limit || 50;
        const result = await getTopRated(limit);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

// GET /:id/summary - Get show summary by ID
showRoutes.get('/:id/summary', validateShowId, async (request: Request<{ id: string }>, response: Response<ShowSummary | ErrorResponse>) => {
    try {
        const id = parseInt(request.params.id);
        const result = await getShowById(id);

        if (result === null) {
            return response.status(404).json({
                error: 'No Shows Found with ID: ' + id
            });
        }

        const cResult = convertShowDetailsToShowSummary(result);
        return response.json(cResult);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

// GET /:id - Get full show details by ID
showRoutes.get('/:id', validateShowId, async (request: Request<{ id: string }>, response: Response<ShowDetail | ErrorResponse>) => {
    try {
        const id = parseInt(request.params.id);
        const result = await getShowById(id);

        if (result === null) {
            return response.status(404).json({
                error: 'No Shows Found with ID: ' + request.params.id
            });
        }

        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

export default showRoutes;