/**
 * Server management code for Group 1 Television API
 * 
 * @author Preston Sia, Mathew Belmont, Sean Miller, Abdul Hassan
 */

import createApp from '@/app';          // Import from app.ts
import { validateEnv } from './core/utilities/envConfig';
import { connectToDatabase, disconnectFromDatabase } from './core/utilities/database';

const PORT = process.env.PORT || 8000;

/**
 * START the server
 * Includes graceful shutdown handling
 */
const startServer = async(): Promise<void> => {
    try {
        // Validate environment
        validateEnv();
        console.log('Environment variables validated');

        // Connect to database
        await connectToDatabase();
        console.log('Database connection established');

        const app = createApp();        // launch the Express app
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // GRACEFUL Shutdown handling
        const gracefulShutdown = (sig: string) => {
            console.log(`\n Received ${sig}. Starting graceful shutdown...`);

            server.close(async (err) => {
                if (err) {
                    console.error('Error during server shutdown: ', err);
                    process.exit(1);
                }

                await disconnectFromDatabase();
                console.log('Database connection closed');

                console.log('Server closed successfully. Goodbye!');
                process.exit(0);
            });
        };


        // Register SIGNAL HANDLERS for graceful shutdown
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));   // SIGTERM
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));     // SIGINT
    } catch (err) {
        console.error('Failed to start server: ', err);
        process.exit(1);
    }
};

// Handle uncaught EXCEPTIONS and REJECTIONS
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at: ', promise, 'readon: ', reason);
    process.exit(1);
});

// Actually START the server
startServer();
