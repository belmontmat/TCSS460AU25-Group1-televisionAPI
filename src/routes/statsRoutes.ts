/**
 * Routes for getting quick aggrigations and stats
 */
import { getGenreStats, getNetworkStats } from '@/controller/statsRoutesController';
import { Router } from 'express';

const statsRoutes = Router();

statsRoutes.get('/genres', async(request, response) => {
    try {
        const result = await getGenreStats();
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

statsRoutes.get('/networks', async(request, response) => {
    try {

        const result = await getNetworkStats();
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

export default statsRoutes;