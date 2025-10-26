/**
 * Routes for getting quick aggrigations and stats
 */
<<<<<<< HEAD
import { getActorStats, getCompanyStats, getCountryStats, getGenreStats, getNetworkStats, getStatusStats, getYearStats } from '@/controller/statsRoutesController';
=======
import { getGenreStats, getNetworkStats } from '@/controller/statsRoutesController';
>>>>>>> 12319ac (updated functionality for stats to reduce route numbers)
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

statsRoutes.get('/actors', async(request, response) => {
    try {

        const result = await getActorStats();
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

statsRoutes.get('/years', async(request, response) => {
    try {

        const result = await getYearStats();
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

statsRoutes.get('/countries', async(request, response) => {
    try {

        const result = await getCountryStats();
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

statsRoutes.get('/status', async(request, response) => {
    try {

        const result = await getStatusStats();
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

statsRoutes.get('/companies', async(request, response) => {
    try {

        const result = await getCompanyStats();
        
        return response.json(result);
        
    } catch (error) {
        return response.status(500).json({
            error: 'Internal server error: ' + error
        });
    }
});

export default statsRoutes;