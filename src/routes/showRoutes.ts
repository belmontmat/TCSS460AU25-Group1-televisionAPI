/**
 * Routes for TV show listings
 */

import { getShowById, getShowList , getRandomShows, getLongestRunning, getPopular, getTopRated} from '@/controller/showRoutesController';
import { convertShowDetailsToShowSummary } from '@/core/utilities/convert';
import {Router} from 'express';

const showRoutes = Router();

showRoutes.get('/', async(request, response) => {
    try {
        const page = Math.max(parseInt(request.query.page as string), 1) || 1;
        const limit = Math.min(parseInt(request.query.limit as string), 100) || 50;

        const result = await getShowList(page, limit);
        response.json(result);
    } catch (error) {
        response.status(500).json({error: 'Internal server error: ' + error});
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
