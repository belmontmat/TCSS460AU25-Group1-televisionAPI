/**
 * Server management code for Group 1 Television API
 * 
 * @author Preston Sia, Mathew Belmont, Sean Miller, Abdul Hassan
 */

import createApp from '@/app';          // Import from app.ts
import { getEnvVar } from './core/utilities/envConfig';

const PORT = getEnvVar('PORT');

/**
 * START the server
 * Includes graceful shutdown handling
 */
const startServer = async(): Promise<void> => {
    try {
        const app = createApp();        // launch the Express app
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // GRACEFUL Shutdown handling
        const gracefulShutdown = (sig: string) => {
            console.log(`\n Received ${sig}. Starting graceful shutdown...`);

            server.close((err) => {
                if (err) {
                    console.error('Error during server shutdown: ', err);
                    process.exit(1);
                }

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
