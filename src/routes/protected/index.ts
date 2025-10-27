/**
 * All routes protected by an API key
 */

import { createActor } from '@/controller/adminRoutes/adminActorsController';
import { addShow, deleteShow, updateShow } from '@/controller/adminRoutes/adminShowsController';
import { validateActorCreate } from '@/core/middleware/adminActorsValidation';
import { validateShowCreate, validateShowUpdate } from '@/core/middleware/adminShowsValidation';
import { Router } from 'express';
import { apiKeyAuth } from '@middleware/apiKeyAuth';

const protectedRoutes = Router();

// Apply API key authentication to all routes in this router
protectedRoutes.use(apiKeyAuth);

/** Add a new TV show */
protectedRoutes.post('/shows', validateShowCreate, addShow);

/** Update show information */
protectedRoutes.put('/shows/:id', validateShowUpdate, updateShow);

/** Delete a show by ID */
protectedRoutes.delete('/shows/:id', deleteShow);

/** Add a new actor */
protectedRoutes.post('/actors', validateActorCreate, createActor);

export default protectedRoutes;
