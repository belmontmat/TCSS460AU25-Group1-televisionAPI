/**
 * All routes protected by an API key
 */

import { validateActorCreate } from '@/core/middleware/adminActorsValidation';
import { Router } from 'express';

const protectedRoutes = Router();

// ADD API Key auth middleware here

/** Add a new TV show */
protectedRoutes.post('/shows');

/** Update show information */
protectedRoutes.put('/shows/:id');

/** Delete a show by ID */
protectedRoutes.delete('/shows/:id');

/** Add a new actor */
protectedRoutes.post('/actors', validateActorCreate);

export default protectedRoutes;
