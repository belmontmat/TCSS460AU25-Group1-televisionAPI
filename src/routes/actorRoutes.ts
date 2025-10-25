/**
 * Routes for actor information
 */

import {Router} from 'express';
import { getAllActors, getActorById } from '@/controller/actorRoutesController';

const actorRoutes = Router();

/**
 * Get a list of all actors.
 * A page and limit of entries for each page may be specified
*/
actorRoutes.get('/', getAllActors);

/**
 * Get detailed information about an actor by id
 */
actorRoutes.get('/:id', getActorById);

export default actorRoutes;
