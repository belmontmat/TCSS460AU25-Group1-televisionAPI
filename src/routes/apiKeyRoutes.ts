/**
 * API Key Routes
 *
 * Public routes for API key generation.
 * Provides endpoints for users to generate new API keys for authentication.
 *
 * Routes:
 * - POST /api-key - Generate new API key
 */

import { Router } from 'express';
import { generateApiKeyController,} from '../controller/apiKeyController';
import { validateGenerateApiKey } from '../core/middleware/apiKeyValidation';

export const apiKeyRoutes = Router();

/**
 * POST /api-key
 * Generate a new API key
 *
 * Request Body:
 * - name: string (required) - Name of person/service
 * - email: string (optional) - Contact email
 *
 * Validation: validateGenerateApiKey middleware
 * - Ensures name is 1-255 characters
 * - Validates email format if provided
 *
 * Response:
 * - 201: API key generated successfully with usage instructions
 * - 400: Validation failed
 * - 500: Server error
 */
apiKeyRoutes.post('/', validateGenerateApiKey, generateApiKeyController);
