# auto-api TypeScript Client

TypeScript client for [auto-api.com](https://auto-api.com) — car listings API across 8 marketplaces.

## Quick Start

```bash
npm install @autoapicom/client
```

```typescript
import { Client } from '@autoapicom/client';

const client = new Client('your-api-key', 'https://api1.auto-api.com');
const offers = await client.getOffers('encar', { page: 1, brand: 'BMW' });
```

## Build

```bash
npm install
npm run build
```

## Key Files

- `src/client.ts` — Client class, all 6 public API methods
- `src/errors.ts` — ApiError and AuthError classes
- `src/index.ts` — Public API exports
- `package.json` — ESM package, Node 18+, zero runtime dependencies
- `tsconfig.json` — Strict mode, ES2022 target, declarations enabled

## Conventions

- TypeScript with strict mode
- ESM only (`"type": "module"`)
- Built-in fetch (Node 18+), zero runtime dependencies
- Methods return plain objects (parsed JSON), no wrapper types
- snake_case for API parameters (same as API, consistent with PHP client)
- Source name passed as first parameter to each method
- All comments and docblocks in English

## API Methods

| Method | Params | Returns |
|--------|--------|---------|
| `getFilters(source)` | source name | filters object |
| `getOffers(source, params)` | source + filters | `{result: [], meta: {page, next_page}}` |
| `getOffer(source, innerId)` | source + inner_id | single offer object |
| `getChangeId(source, date)` | source + yyyy-mm-dd | numeric change_id |
| `getChanges(source, changeId)` | source + change_id | `{result: [], meta: {next_change_id}}` |
| `getOfferByUrl(url)` | marketplace URL | offer object |
