# auto-api-client-typescript

[![npm version](https://img.shields.io/npm/v/@auto-api/client)](https://www.npmjs.com/package/@auto-api/client)
[![Node version](https://img.shields.io/node/v/@auto-api/client)](https://www.npmjs.com/package/@auto-api/client)
[![License](https://img.shields.io/npm/l/@auto-api/client)](LICENSE)

TypeScript client for [auto-api.com](https://auto-api.com) — car listings API across multiple marketplaces.

One API to access car listings from 8 marketplaces: encar, mobile.de, autoscout24, che168, dongchedi, guazi, dubicars, dubizzle. Search offers, track price changes, and get listing data in a unified format.

## Installation

```bash
npm install @auto-api/client
```

## Usage

```typescript
import { Client } from '@auto-api/client';

const client = new Client('your-api-key');
```

### Get filters

```typescript
const filters = await client.getFilters('encar');
```

### Search offers

```typescript
const offers = await client.getOffers('mobilede', {
    page: 1,
    brand: 'BMW',
    year_from: 2020,
});

// Pagination
console.log(offers.meta.page);
console.log(offers.meta.next_page);
```

### Get single offer

```typescript
const offer = await client.getOffer('encar', '40427050');
```

### Track changes

```typescript
const changeId = await client.getChangeId('encar', '2025-01-15');
const changes = await client.getChanges('encar', changeId);

// Next batch
const nextBatch = await client.getChanges('encar', changes.meta.next_change_id);
```

### Get offer by URL

```typescript
const info = await client.getOfferByUrl('https://www.encar.com/dc/dc_cardetailview.do?carid=40427050');
```

### Error handling

```typescript
import { Client, AuthError, ApiError } from '@auto-api/client';

try {
    const offers = await client.getOffers('encar', { page: 1 });
} catch (e) {
    if (e instanceof AuthError) {
        // 401/403 — invalid API key
    } else if (e instanceof ApiError) {
        console.log(e.statusCode);
        console.log(e.message);
    }
}
```

## Supported sources

| Source | Platform | Region |
|--------|----------|--------|
| `encar` | [encar.com](https://www.encar.com) | South Korea |
| `mobilede` | [mobile.de](https://www.mobile.de) | Germany |
| `autoscout24` | [autoscout24.com](https://www.autoscout24.com) | Europe |
| `che168` | [che168.com](https://www.che168.com) | China |
| `dongchedi` | [dongchedi.com](https://www.dongchedi.com) | China |
| `guazi` | [guazi.com](https://www.guazi.com) | China |
| `dubicars` | [dubicars.com](https://www.dubicars.com) | UAE |
| `dubizzle` | [dubizzle.com](https://www.dubizzle.com) | UAE |

## Other languages

| Language | Package |
|----------|---------|
| PHP | [auto-api/client](https://github.com/autoapicom/auto-api-php) |
| Python | [auto-api-client](https://github.com/autoapicom/auto-api-python) |
| Go | [auto-api-go](https://github.com/autoapicom/auto-api-go) |
| C# | [AutoApi.Client](https://github.com/autoapicom/auto-api-dotnet) |
| Java | [auto-api-client](https://github.com/autoapicom/auto-api-java) |
| Ruby | [auto-api-client](https://github.com/autoapicom/auto-api-ruby) |
| Rust | [auto-api-client](https://github.com/autoapicom/auto-api-rust) |

## Documentation

[auto-api.com](https://auto-api.com)
