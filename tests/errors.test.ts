import { describe, it, expect } from 'vitest';
import { ApiError, AuthError } from '../src/errors.js';

// ── ApiError ────────────────────────────────────────────────────

describe('ApiError', () => {
    it('extends Error', () => {
        const error = new ApiError('Something failed', 500);
        expect(error).toBeInstanceOf(Error);
    });

    it('has name set to ApiError', () => {
        const error = new ApiError('fail', 500);
        expect(error.name).toBe('ApiError');
    });

    it('stores message', () => {
        const error = new ApiError('Something went wrong', 500);
        expect(error.message).toBe('Something went wrong');
    });

    it('stores statusCode', () => {
        const error = new ApiError('Error', 422);
        expect(error.statusCode).toBe(422);
    });

    it('stores responseBody when provided', () => {
        const body = { message: 'Validation failed', errors: ['field required'] };
        const error = new ApiError('Error', 422, body);
        expect(error.responseBody).toEqual(body);
    });

    it('responseBody is undefined by default', () => {
        const error = new ApiError('Error', 500);
        expect(error.responseBody).toBeUndefined();
    });

    it('statusCode is readonly', () => {
        const error = new ApiError('Error', 503);
        expect(error.statusCode).toBe(503);
    });
});

// ── AuthError ───────────────────────────────────────────────────

describe('AuthError', () => {
    it('extends ApiError', () => {
        const error = new AuthError();
        expect(error).toBeInstanceOf(ApiError);
    });

    it('extends Error', () => {
        const error = new AuthError();
        expect(error).toBeInstanceOf(Error);
    });

    it('has name set to AuthError', () => {
        const error = new AuthError();
        expect(error.name).toBe('AuthError');
    });

    it('has default message', () => {
        const error = new AuthError();
        expect(error.message).toBe('Invalid or missing API key');
    });

    it('has default statusCode 401', () => {
        const error = new AuthError();
        expect(error.statusCode).toBe(401);
    });

    it('accepts custom message', () => {
        const error = new AuthError('Access denied');
        expect(error.message).toBe('Access denied');
    });

    it('accepts custom statusCode', () => {
        const error = new AuthError('Forbidden', 403);
        expect(error.statusCode).toBe(403);
    });

    it('responseBody is undefined', () => {
        const error = new AuthError();
        expect(error.responseBody).toBeUndefined();
    });
});
