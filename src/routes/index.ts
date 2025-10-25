/**
 * Main Express routes for this server.
 */

import {Router} from 'express';
import showRoutes from './showRoutes';
import actorRoutes from './actorRoutes';

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

routes.use('/actors', actorRoutes);

export default routes;