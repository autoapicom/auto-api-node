# Claude Instructions — auto-api-node

## Language

All code comments, documentation, and commit messages must be in **English**.

## Commands

- Install dependencies: `npm install`
- Build project: `npm run build`

## Key Files

- `src/client.ts` — main Client class with 6 async methods
- `src/errors.ts` — ApiError and AuthError exception classes
- `src/index.ts` — public API entry point (re-exports)
- `package.json` — package configuration
- `tsconfig.json` — TypeScript compiler options

## Code Style

- TypeScript with strict mode enabled
- ESM only — no CommonJS
- Node 18+ built-in `fetch` for HTTP requests — zero runtime dependencies
- Methods return plain objects — no wrapper or DTO types
- `snake_case` for API parameter names
- English comments only
- Keep the codebase simple — avoid unnecessary abstractions
