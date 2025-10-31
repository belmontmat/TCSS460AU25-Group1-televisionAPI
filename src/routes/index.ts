import { Router } from 'express';
import showRoutes from './showRoutes';
import protectedRoutes from './protected';
import actorRoutes from './actorRoutes';
import genreRoutes from './genreRoutes';
import { apiKeyRoutes } from './apiKeyRoutes';
import statsRoutes from './statsRoutes';

const routes = Router();

routes.get('/', (request, response) => {
    response.json({
        success: true,
        message: 'If you\'re reading this message, the server is working!',
        version: '0.0.1',
        timestamp: new Date().toISOString(),
        endpoints: {
            shows: '/shows - TV show listings and details',
            actors: '/actors - Actor information',
            genres: '/genres - Genre listings',
            stats: '/stats - Statistical aggregations',
            apiKey: '/api-key - API key management',
            admin: '/admin - Protected admin endpoints',
            documentation: '/api-docs - API documentation (Swagger UI)'
        }
    });
});

routes.use('/shows', showRoutes);
routes.use('/genres', genreRoutes);
routes.use('/stats', statsRoutes);
routes.use('/api-key', apiKeyRoutes);
routes.use('/admin', protectedRoutes);
routes.use('/actors', actorRoutes);

export default routes;