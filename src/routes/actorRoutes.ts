/**
 * Routes for actor information
 */

import {Router} from 'express';
import { getActors, getActorById, getActorShowsById } from '@/controller/actorRoutesController';
import { validateActorId, validateActorQueries } from '@/core/middleware/actorValidation';

const actorRoutes = Router();

/**
 * Get a list of actors.
 * A page and limit of entries for each page may be specified
*/
actorRoutes.get('/', validateActorQueries, getActors);

/**
 * Get detailed information about an actor by id
 */
actorRoutes.get('/:id', validateActorId, getActorById);

/**
 * Get all shows featuring a specific actor
 */
actorRoutes.get('/:id/shows', validateActorId, getActorShowsById);

export default actorRoutes;
