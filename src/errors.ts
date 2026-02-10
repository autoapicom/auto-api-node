export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly responseBody: unknown;

    constructor(message: string, statusCode: number, responseBody?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}

export class AuthError extends ApiError {
    constructor(message: string = 'Invalid or missing API key', statusCode: number = 401) {
        super(message, statusCode);
        this.name = 'AuthError';
    }
}
