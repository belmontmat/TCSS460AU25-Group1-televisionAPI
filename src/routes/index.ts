/**
 * Main Express routes for this server.
 */

import {Router} from 'express';
import protectedRoutes from './protected';
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

routes.use('/api-key', apiKeyRoutes);
routes.use('/', protectedRoutes);

export default routes;