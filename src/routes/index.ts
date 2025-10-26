/**
 * Main Express routes for this server.
 */

import {Router} from 'express';
import showRoutes from './showRoutes';
import protectedRoutes from './protected';
import actorRoutes from './actorRoutes';
import genreRoutes from './genreRoutes';
import statsRoutes from './statsRoutes';
import { apiKeyRoutes } from './apiKeyRoutes';

const routes = Router();            // instantiate Router object for export/use

routes.get('/', (request, response) => {
    response.json({
        success: true,
        message: 'If you\'re reading this message, the server is working!',
        version: '0.0.1',
        timestamp: new Date().toISOString(),
        endpoints: {
            
        },
        documentation: 'Not available yet'
    });
});

routes.use('/shows', showRoutes);
routes.use('/genres', genreRoutes);
routes.use('/stats', statsRoutes);

routes.use('/admin', protectedRoutes);

routes.use('/actors', actorRoutes);

routes.use('/api-key', apiKeyRoutes);


export default routes;