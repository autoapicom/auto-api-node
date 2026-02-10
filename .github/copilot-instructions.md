# Copilot Instructions — auto-api-node

This is a TypeScript client library for the auto-api.com vehicle data API.

## Architecture

- Single `Client` class (`src/client.ts`) with 6 async methods
- Every method takes `source` as its first parameter
- Uses Node 18+ built-in `fetch` — zero runtime dependencies
- ESM only — no CommonJS support
- Methods return plain objects (no wrapper or DTO types)
- `snake_case` for all API parameter names

## Exceptions

- `ApiError` — base error class for all API failures
- `AuthError` — thrown on 401/403 responses (extends ApiError)

## Conventions

- TypeScript strict mode enabled
- All code comments and documentation must be in English
- Keep it simple — no unnecessary abstractions or wrapper types
- No runtime dependencies allowed
