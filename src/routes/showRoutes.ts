/**
 * Routes for TV show listings
 */

import { getShowById, getShowList } from '@/controller/showRoutesController';
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
