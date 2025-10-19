/**
 * Routes for TV show listings
 */

import {Router} from 'express';
//import { getShowList } from '@/controller/showRoutesController';
import { ShowRepo } from '@/controller/showRoutesController';

const showRoutes = Router();
const showData = new ShowRepo(); // temporary while the database is still being handled

showRoutes.get('/', async(request, response) => {
    // Replace this with query and formating of data from db
    /* response.json({
        success: true,
        message: 'The show route!',
        version: '0.0.1',
        timestamp: new Date().toISOString(),
        endpoints: {
            
        },
        documentation: 'Not available yet'
    }); */
    try {
        const page = parseInt(request.query.page as string) || 1;
        const limit = parseInt(request.query.limit as string) || 50;

        const result = await showData.getShowList(page, limit);
        response.json(result);
    } catch (error) {
        response.status(500).json({error: 'Internal server error: ' + error});
    }
});

showRoutes.get('/:id', async(request, response) => {
    // Replace this with query and formating of data from db
    /*
    response.json({
        success: true,
        message: 'The show for ID: ' + request.params.id,
        version: '0.0.1',
        timestamp: new Date().toISOString(),
        endpoints: {
            
        },
        documentation: 'Not available yet'
    });*/
    try {
        const result = await showData.getShowById(parseInt(request.params.id));
        if (result === null) {
            response.status(404).json({error: 'No Shows Found with ID: ' + request.params.id});
        } else {
            response.json(result);
        }
    } catch (error) {
        response.status(500).json({error: 'Internal server error: ' + error});
    }
});

export default showRoutes;
