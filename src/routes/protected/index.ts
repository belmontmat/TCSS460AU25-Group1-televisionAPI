/**
 * All routes protected by an API key
 */

import { createActor } from '@/controller/adminRoutes/adminActorsController';
import { addShow } from '@/controller/adminRoutes/adminShowsController';
import { validateActorCreate } from '@/core/middleware/adminActorsValidation';
import { validateShowCreate } from '@/core/middleware/adminShowsValidation';
import { Router } from 'express';
import { apiKeyAuth } from '@middleware/apiKeyAuth';

const protectedRoutes = Router();

// Apply API key authentication to all routes in this router
protectedRoutes.use(apiKeyAuth);

/** Add a new TV show */
protectedRoutes.post('/shows', validateShowCreate, addShow);

/** Update show information */
protectedRoutes.put('/shows/:id');

/** Delete a show by ID */
protectedRoutes.delete('/shows/:id');

/** Add a new actor */
protectedRoutes.post('/actors', validateActorCreate, createActor);

export default protectedRoutes;
