/**
 * Environment Configuration
 */

/**
 * Application configuration interface
 *
 * Type-safe configuration object that defines all available environment
 * variables with their expected types and validation rules.
 */
interface Config {
    /** Server port number */
    PORT: number;
    /** Application environment (development, staging, production) */
    NODE_ENV: string;
    /** CORS allowed origins (comma-sepearted in env file) */
    CORS_ORIGINS: string[];
    /** Request body size limit */
    BODY_LIMIT: string;
    /** enable request logging */
    ENABLE_LOGGIN: boolean;
    /** API version identifier */
    API_VERSION: string;
}