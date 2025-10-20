/**
 * Routes for TV show listings
 */

import {Router} from 'express';
import { ShowRepo } from '@/controller/showRoutesController';

const showRoutes = Router();
const showData = new ShowRepo();

showRoutes.get('/', async(request, response) => {
    try {
        const page = Math.max(parseInt(request.query.page as string), 1) || 1;
        const limit = Math.min(parseInt(request.query.limit as string), 100) || 50;

        const result = await showData.getShowList(page, limit);
        response.json(result);
    } catch (error) {
        response.status(500).json({error: 'Internal server error: ' + error});
    }
});

showRoutes.get('/:id', async(request, response) => {
    try {
        const result = await showData.getShowById(parseInt(request.params.id));
        const exact = /^\d{6}$/;
        if (result === null || !exact.test(request.params.id)) {
            response.status(404).json({error: 'No Shows Found with ID: ' + request.params.id});
        } else {
            response.json(result);
        }
    } catch (error) {
        response.status(500).json({error: 'Internal server error: ' + error});
    }
});

export default showRoutes;
