/**
 * Main Express routes for this server.
 */

import {Router} from 'express';

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

routes.get('/shows', (request, response) => {
    // Replace this with query and formating of data from db
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

routes.get('/shows/:id', (request, response) => {
    // Replace this with query and formating of data from db
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

export default routes;