/**
 * API Error response structure.
 */
export interface ApiErrorResponse {
    readonly code: string;
    readonly message: string;
    readonly details?: unknown;
}

/**
 * Custom API Error class.
 */
export class ApiError extends Error {
    constructor(
        public readonly code: string,
        public readonly statusCode: number,
        message: string,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }

    toResponse(): ApiErrorResponse {
        return {
            code: this.code,
            message: this.message,
            details: this.details,
        };
    }
}

// Factory functions
export const validationError = (message: string, details?: unknown) =>
    new ApiError('VALIDATION_ERROR', 400, message, details);

export const notFoundError = (resource: string) =>
    new ApiError('NOT_FOUND', 404, `${resource} not found`);

export const forbiddenError = (message: string) =>
    new ApiError('FORBIDDEN', 403, message);

export const conflictError = (message: string) =>
    new ApiError('CONFLICT', 409, message);

export const domainError = (message: string) =>
    new ApiError('DOMAIN_ERROR', 422, message);

export const internalError = (message: string) =>
    new ApiError('INTERNAL_ERROR', 500, message);
