/**
 * Main Express routes for this server.
 */

import {Router} from 'express';
import showRoutes from './showRoutes';
import protectedRoutes from './protected';
import actorRoutes from './actorRoutes';
import genreRoutes from './genreRoutes';
import { apiKeyRoutes } from './apiKeyRoutes';
import statsRoutes from './statsRoutes';

const routes = Router();            // instantiate Router object for export/use

routes.get('/', (request, response) => {
    response.json({
        success: true,
        message: 'If you\'re reading this message, the server is working!',
        version: '0.0.1',
        timestamp: new Date().toISOString(),
        endpoints: {
            
        },
        documentation: 'Visit the get/api-docs route!'
    });
});

routes.use('/shows', showRoutes);
routes.use('/genres', genreRoutes);
routes.use('/stats', statsRoutes);
routes.use('/api-key', apiKeyRoutes);
routes.use('/admin', protectedRoutes);
routes.use('/actors', actorRoutes);
export default routes;