# auto-api-client-typescript

[![npm version](https://img.shields.io/npm/v/@autoapicom/client)](https://npmjs.com/package/@autoapicom/client)
[![Node version](https://img.shields.io/node/v/@autoapicom/client)](https://npmjs.com/package/@autoapicom/client)
[![License](https://img.shields.io/npm/l/@autoapicom/client)](LICENSE)

TypeScript client for the [auto-api.com](https://auto-api.com) car listings API. Zero dependencies — uses the built-in `fetch`.

Search and filter offers across 8 marketplaces (encar, mobile.de, autoscout24, che168, dongchedi, guazi, dubicars, dubizzle), track price changes, pull individual listings by ID or URL.

## Installation

```bash
npm install @autoapicom/client
```

## Usage

```typescript
import { Client } from '@autoapicom/client';

const client = new Client('your-api-key', 'https://api1.auto-api.com');
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
const info = await client.getOfferByUrl('https://encar.com/dc/dc_cardetailview.do?carid=40427050');
```

### Error handling

```typescript
import { Client, AuthError, ApiError } from '@autoapicom/client';

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
| `encar` | [encar.com](https://encar.com) | South Korea |
| `mobilede` | [mobile.de](https://mobile.de) | Germany |
| `autoscout24` | [autoscout24.com](https://autoscout24.com) | Europe |
| `che168` | [che168.com](https://che168.com) | China |
| `dongchedi` | [dongchedi.com](https://dongchedi.com) | China |
| `guazi` | [guazi.com](https://guazi.com) | China |
| `dubicars` | [dubicars.com](https://dubicars.com) | UAE |
| `dubizzle` | [dubizzle.com](https://dubizzle.com) | UAE |

## Other languages

| Language | Package |
|----------|---------|
| PHP | [autoapi/client](https://github.com/autoapicom/auto-api-php) |
| Python | [autoapicom-client](https://github.com/autoapicom/auto-api-python) |
| Go | [auto-api-go](https://github.com/autoapicom/auto-api-go) |
| C# | [AutoApi.Client](https://github.com/autoapicom/auto-api-dotnet) |
| Java | [auto-api-client](https://github.com/autoapicom/auto-api-java) |
| Ruby | [auto-api-client](https://github.com/autoapicom/auto-api-ruby) |
| Rust | [auto-api-client](https://github.com/autoapicom/auto-api-rust) |

## Documentation

[auto-api.com](https://auto-api.com)
