/**
 * Routes for actor information
 */

import {Router} from 'express';
import { getActors, getActorById } from '@/controller/actorRoutesController';
import { validateActorQueries } from '@/core/middleware/actorValidation';

const actorRoutes = Router();

/**
 * Get a list of actors.
 * A page and limit of entries for each page may be specified
*/
actorRoutes.get('/', getActors);

/**
 * Get detailed information about an actor by id
 */
actorRoutes.get('/:id', validateActorQueries, getActorById);

export default actorRoutes;
