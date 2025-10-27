/**
 * All routes protected by an API key
 */

import { createActor } from '@/controller/adminRoutes/adminActorsController';
import { addShow, deleteShow, updateShow } from '@/controller/adminRoutes/adminShowsController';
import { validateActorCreate } from '@/core/middleware/adminActorsValidation';
import { validateShowCreate, validateShowId, validateShowUpdate } from '@/core/middleware/adminShowsValidation';
import { Router } from 'express';
import { apiKeyAuth } from '@middleware/apiKeyAuth';

const protectedRoutes = Router();

// Apply API key authentication to all routes in this router
protectedRoutes.use(apiKeyAuth);

protectedRoutes.post('/shows', validateShowCreate, addShow);
protectedRoutes.put('/shows/:id', validateShowId, validateShowUpdate, updateShow);
protectedRoutes.delete('/shows/:id', validateShowId, deleteShow);

/** Add a new actor */
protectedRoutes.post('/actors', validateActorCreate, createActor);

export default protectedRoutes;
