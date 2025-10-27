/**
 * API Key Controller
 *
 * Handles API key generation and management operations.
 * Provides endpoints for creating new API keys and serving the key generation form.
 *
 * Educational Focus:
 * - Demonstrates stateful authentication (keys stored in database)
 * - Shows key generation and secure storage patterns
 * - Illustrates HTML form serving from Express endpoints
 *
 * @see {@link ../../docs-2.0/authentication-guide.md} for auth pattern comparisons (planned)
 */

import { Request, Response } from 'express';
import { getPool } from '@utilities/database';
import { sendSuccess, sendError } from '@utilities/responseUtils';
import { generateApiKey } from '@utilities/apiKeyUtils';
import { ApiKeyRequest, ApiKeyResponse } from '../types/apiKeyTypes';
import { ErrorCodes } from '@/types/errorTypes';

/**
 * Generate a new API key for a user
 *
 * Creates a unique API key, stores it in the database with user metadata,
 * and returns the key to the user with usage instructions.
 *
 * Educational Notes:
 * - Keys are shown only once during generation (like GitHub PATs)
 * - UUID v4 provides cryptographically secure random keys
 * - Database stores keys with metadata for tracking and management
 *
 * Request Body (from ApiKeyRequest):
 * - name: string (required) - Name of the person/service
 * - email: string (required) - Contact email
 *
 * @param request - Express request with ApiKeyRequest body
 * @param response - Express response
 * @returns Promise<void>
 * @example
 * POST /api-key
 * Body: { name: "John Doe", email: "john@example.com" }
 * Response: {
 *   success: true,
 *   data: {
 *     api_key: "550e8400-e29b-41d4-a716-446655440000",
 *     name: "John Doe",
 *     created_at: "2024-01-15T10:30:00.000Z",
 *     usage: "Include this key in the X-API-Key header..."
 *   }
 * }
 */
export const generateApiKeyController = async (request: Request, response: Response): Promise<void> => {
    try {
        const { name, email }: ApiKeyRequest = request.body;

        const pool = getPool();

        // Generate new API key
        const apiKey = generateApiKey();

        // Insert into database
        const result = await pool.query(
            `INSERT INTO api_keys (api_key, name, email, is_active, created_at, request_count)
             VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP, 0)
             RETURNING api_key, name, email, created_at`,
            [apiKey, name, email]
        );

        const keyData = result.rows[0];

        const responseData: ApiKeyResponse = {
            api_key: keyData.api_key,
            name: keyData.name,
            created_at: keyData.created_at.toISOString(),
            usage: `Include this key in the X-API-Key header for protected endpoints: curl -H "X-API-Key: ${keyData.api_key}"`
        };

        sendSuccess(
            response,
            responseData,
            "API key generated successfully - save this key, it won't be shown again!",
            201
        );

    } catch (error) {
        console.error('Error generating API key:', error);
        sendError(
            response,
            500,
            "Failed to generate API key - please try again",
            ErrorCodes.SRVR_INTERNAL_ERROR
        );
    }
};
