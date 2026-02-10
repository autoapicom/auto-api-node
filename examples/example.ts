/**
 * Auto API TypeScript Client — Complete usage example.
 *
 * Replace 'your-api-key' with your actual API key from https://auto-api.com
 *
 * Run: npx tsx examples/example.ts
 */

import { Client, AuthError, ApiError } from '@auto-api/client';

const client = new Client('your-api-key');
const source = 'encar';

// --- Get available filters ---

const filters = client.getFilters(source);
console.log('Filters:', Object.keys(await filters));

// --- Search offers with filters ---

const offers: any = await client.getOffers(source, {
    page: 1,
    brand: 'Hyundai',
    year_from: 2020,
    price_to: 50000,
});

console.log(`\n--- Offers (page ${offers.meta.page}) ---`);
for (const item of offers.result) {
    const d = item.data;
    console.log(`${d.mark} ${d.model} ${d.year} — $${d.price} (${d.km_age} km)`);
}

// Pagination
if (offers.meta.next_page) {
    const nextPage: any = await client.getOffers(source, {
        page: offers.meta.next_page,
        brand: 'Hyundai',
        year_from: 2020,
    });
    console.log(`Next page has ${nextPage.result.length} offers`);
}

// --- Get single offer ---

const innerId = offers.result[0]?.inner_id ?? '40427050';
const offer: any = await client.getOffer(source, innerId);

console.log('\n--- Single offer ---');
console.log(`URL: ${offer.data.url}`);
console.log(`Seller: ${offer.data.seller_type}`);
console.log(`Images: ${offer.data.images.length}`);

// --- Track changes ---

const changeId = await client.getChangeId(source, '2025-01-15');
console.log(`\n--- Changes from 2025-01-15 (change_id: ${changeId}) ---`);

const changes: any = await client.getChanges(source, changeId);
for (const change of changes.result) {
    console.log(`[${change.change_type}] ${change.inner_id}`);
}

// Fetch next batch
if (changes.meta.next_change_id) {
    const moreChanges: any = await client.getChanges(source, changes.meta.next_change_id);
    console.log(`Next batch: ${moreChanges.result.length} changes`);
}

// --- Get offer by URL ---

const info: any = await client.getOfferByUrl('https://www.encar.com/dc/dc_cardetailview.do?carid=40427050');
console.log(`\n--- Offer by URL ---`);
console.log(`${info.mark} ${info.model} ${info.year} — $${info.price}`);

// --- Error handling ---

try {
    const badClient = new Client('invalid-key');
    await badClient.getOffers('encar', { page: 1 });
} catch (e) {
    if (e instanceof AuthError) {
        console.log(`\nAuth error: ${e.message} (HTTP ${e.statusCode})`);
    } else if (e instanceof ApiError) {
        console.log(`\nAPI error: ${e.message} (HTTP ${e.statusCode})`);
    }
}
