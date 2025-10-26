/**
 * All routes protected by an API key
 */

import { createActor } from '@/controller/adminRoutes/adminActorsController';
import { deleteShow } from '@/controller/adminRoutes/adminShowController';
import { validateActorCreate } from '@/core/middleware/adminActorsValidation';
import { validateId } from '@/core/middleware/sharedValidation';
import { Router } from 'express';

const protectedRoutes = Router();

// ADD API Key auth middleware here

/** Add a new TV show */
protectedRoutes.post('/shows');

/** Update show information */
protectedRoutes.put('/shows/:id', validateId);

/** Delete a show by ID */
protectedRoutes.delete('/shows/:id', validateId, deleteShow);

/** Add a new actor */
protectedRoutes.post('/actors', validateActorCreate, createActor);

export default protectedRoutes;
