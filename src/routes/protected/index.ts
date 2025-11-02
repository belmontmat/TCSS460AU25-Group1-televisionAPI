/**
 * All routes protected by an API key
 */

import showRoutes from './showRoutes';
import actorRoutes from './actorRoutes';
import genreRoutes from './genreRoutes';
import statsRoutes from './statsRoutes';
import { createActor } from '@/controller/adminRoutes/adminActorsController';
import { addShow, deleteShow, updateShow } from '@/controller/adminRoutes/adminShowsController';
import { validateActorCreate } from '@/core/middleware/adminActorsValidation';
import { validateShowCreate, validateShowId, validateShowUpdate } from '@/core/middleware/adminShowsValidation';
import { Router } from 'express';
import { apiKeyAuth } from '@middleware/apiKeyAuth';

const protectedRoutes = Router();

// Apply API key authentication to all routes in this router
protectedRoutes.use(apiKeyAuth);



/** "admin" routes */
protectedRoutes.use('/shows', showRoutes);
protectedRoutes.use('/genres', genreRoutes);
protectedRoutes.use('/stats', statsRoutes);
protectedRoutes.use('/actors', actorRoutes);

protectedRoutes.post('/admin/shows', validateShowCreate, addShow);
protectedRoutes.put('/admin/shows/:id', validateShowId, validateShowUpdate, updateShow);
protectedRoutes.delete('/admin/shows/:id', validateShowId, deleteShow);

/** Add a new actor */
protectedRoutes.post('/admin/actors', validateActorCreate, createActor);

export default protectedRoutes;
