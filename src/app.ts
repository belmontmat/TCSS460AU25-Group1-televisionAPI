/**
 * Express application for the Group 1 Television API
 * 
 * @author Preston Sia, Mathew Belmont, Sean Miller, Abdul Hassan
 */

import cors from 'cors';
import express, {Express} from 'express';
import { readFileSync } from 'fs';
import routes from '@/routes/index';
import swaggerUi from 'swagger-ui-express';
import { load } from 'js-yaml';
import path from 'path';

const swaggerDocument = load(
    readFileSync(path.join(__dirname, '../project_files/tv_api_swagger.yaml'), 'utf8')
  ) as swaggerUi.JsonObject;

const createApp = (): Express => {
    const app = express();          // instantiate the express app object

    // MIDDLEWARE configuration
    app.use(cors());                // cross-origin middleware (move to middleware folder?)
    app.use(express.json({ limit: '10mb' }));     // allow json payloads

    // Configure base ROUTES
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/', routes);           // Express router configuration

    return app;
};

export default createApp;
