/**
 * Routes for genre based queries
 */

import { getGenreList } from '@/controller/genreRoutesController';
import {Router} from 'express';

const genreRoutes = Router();

genreRoutes.get('/', async(request, response) => {
    try {
        const result = await getGenreList();
        return response.json(result);
    } catch (error) {
        return response.status(500).json({error: 'Internal server error: ' + error});
    }
});

export default genreRoutes;