/**
 * Routes for TV show listings
 */

import {Router} from 'express';
//import { getShowList } from '@/controller/showRoutesController';

const showRoutes = Router();

showRoutes.get('/', (request, response) => {
    // Replace this with query and formating of data from db
    response.json({
        success: true,
        message: 'The show route!',
        version: '0.0.1',
        timestamp: new Date().toISOString(),
        endpoints: {
            
        },
        documentation: 'Not available yet'
    });
});

showRoutes.get('/:id', (request, response) => {
    // Replace this with query and formating of data from db
    response.json({
        success: true,
        message: 'The show for ID: ' + request.params.id,
        version: '0.0.1',
        timestamp: new Date().toISOString(),
        endpoints: {
            
        },
        documentation: 'Not available yet'
    });
});

export default showRoutes;
