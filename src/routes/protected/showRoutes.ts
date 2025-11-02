/**
 * Routes for TV show listings
 */

import { getShowById, getShowList , getRandomShows, getLongestRunning, getPopular, getTopRated, getShowByFilter} from '@/controller/showRoutesController';
import { convertShowDetailsToShowSummary } from '@/core/utilities/convert';
import {Router} from 'express';

const showRoutes = Router();

showRoutes.get('/', async(request, response) => {
    try {
        const page = Math.max(parseInt(request.query.page as string), 1) || 1;
        const limit = Math.min(parseInt(request.query.limit as string), 100) || 50;

        const result = await getShowList(page, limit);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({error: 'Internal server error: ' + error});
    }
});

showRoutes.get('/filter', async(request, response) => {
    try {
        const actors = request.query.actors?.toString() || ''; // a comma-separated list of actor names
        const genres = request.query.genres?.toString() || ''; // a comma-separated list of genre names
        const network = request.query.network?.toString() || '';
        const studios = request.query.studios?.toString() || ''; // a comma-separated list of studio names
        const status = request.query.status?.toString() || '';
        const minRating = parseFloat(request.query.min_rating as string) || 0;
        const maxRating = parseFloat(request.query.max_rating as string) || 10;
        const startDate = request.query.startDate?.toString() || '1900-01-01';
        const endDate = (request.query.endDate?.toString() ?? new Date().toISOString().split('T')[0]) as string;
        const country = request.query.country?.toString() || '';
        const creators = request.query.creators?.toString() || ''; // a comma-separated list of creator names
        const name = request.query.name?.toString() || ''; // this should work for original_name and name

        const page = Math.max(parseInt(request.query.page as string), 1) || 1;
        const limit = Math.min(parseInt(request.query.limit as string), 100) || 50;

        const result = await getShowByFilter(actors, genres, network, studios, status, minRating, maxRating, startDate, endDate, country, creators, name, page, limit);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({error: 'Internal server error: ' + error});
    }
});

showRoutes.get('/random', async(request, response) => {
    try {
        let count = parseInt(request.query.count?.toString() || '10') || 10;
        if (count <= 0 || count > 100) {
            count = 10;
        }
        
        const result = await getRandomShows(count);
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

showRoutes.get('/longest-running', async(request, response) => {
    try {
        let limit = Math.min(parseInt(request.query.limit as string), 100) || 50;
        if (limit <= 0 || limit > 100) {
            limit = 10;
        }
        const result = await getLongestRunning(limit);

        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

showRoutes.get('/popular', async(request, response) => {
    try {
        let limit = Math.min(parseInt(request.query.limit as string), 100) || 50;
        if (limit <= 0 || limit > 100) {
            limit = 10;
        }
        const result = await getPopular(limit);

        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

showRoutes.get('/top-rated', async(request, response) => {
    try {
        let limit = Math.min(parseInt(request.query.limit as string), 100) || 50;
        if (limit <= 0 || limit > 100) {
            limit = 10;
        }
        const result = await getTopRated(limit);

        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

showRoutes.get('/:id/summary', async(request, response) => {
    try {
        const idPattern = /^\d+$/;
        if (!idPattern.test(request.params.id)) {
            return response.status(400).json({
                error: 'Invalid ID format. ID must be numeric.'
            });
        }
        
        const result = await getShowById(parseInt(request.params.id));
        const cResult = convertShowDetailsToShowSummary(result);
        
        if (result === null) {
            return response.status(404).json({
                error: 'No Shows Found with ID: ' + request.params.id
            });
        }
        
        return response.json(cResult);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

showRoutes.get('/:id', async(request, response) => {
    try {
        const idPattern = /^\d+$/;
        if (!idPattern.test(request.params.id)) {
            return response.status(400).json({
                error: 'Invalid ID format. ID must be numeric.'
            });
        }
        
        const result = await getShowById(parseInt(request.params.id));
        
        if (result === null) {
            return response.status(404).json({
                success:false, error: 'No Shows Found with ID: ' + request.params.id
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
