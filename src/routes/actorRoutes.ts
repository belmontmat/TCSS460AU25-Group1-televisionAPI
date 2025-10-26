/**
 * Routes for actor information
 */

import {Router} from 'express';
import { getActors, getActorById, getActorShowsById, getActorTopRatedShows } from '@/controller/actorRoutesController';
import { validateActorQueries, validateActorRatingCount } from '@/core/middleware/actorValidation';
import { validateId } from '@/core/middleware/sharedValidation';

const actorRoutes = Router();

/**
 * Get a list of actors.
 * A page and limit of entries for each page may be specified
*/
actorRoutes.get('/', validateActorQueries, getActors);

/**
 * Get detailed information about an actor by id
 */
actorRoutes.get('/:id', validateId, getActorById);

/**
 * Get all shows featuring a specific actor
 */
actorRoutes.get('/:id/shows', validateId, getActorShowsById);

/**
 * Get an actor's top rated shows
 */
actorRoutes.get('/:id/ratings', validateId, validateActorRatingCount, getActorTopRatedShows);

export default actorRoutes;
