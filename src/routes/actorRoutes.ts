/**
 * Routes for actor information
 */

import {Router} from 'express';
import { getAllActors } from '@/controller/actorRoutesController';

const actorRoutes = Router();

/**
 * Get a list of all actors.
 * A page and limit of entries for each page may be specified
*/
actorRoutes.get('/', getAllActors);

/**
 * Get detailed information about an actor
 */
actorRoutes.get('/:name');

export default actorRoutes;
