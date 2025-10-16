/**
 * Express application for the Group 1 Television API
 * 
 * @author Preston Sia, Mathew Belmont, Sean Miller, Abdul Hassan
 */


import express, {Express} from 'express';
import cors from 'cors';
import routes from '@/routes/index';

const createApp = (): Express => {
    const app = express();          // instantiate the express app object

    // MIDDLEWARE configuration
    app.use(cors());                // cross-origin middleware (move to middleware folder?)

    // Configure base ROUTES
    app.use('/', routes);           // Express router configuration

    return app;
};

export default createApp;
