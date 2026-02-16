import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Client } from '../src/client.js';
import { ApiError, AuthError } from '../src/errors.js';

function mockResponse(body: unknown, status = 200, statusText = 'OK'): Response {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    return {
        ok: status >= 200 && status < 300,
        status,
        statusText,
        text: () => Promise.resolve(bodyStr),
        json: () => Promise.resolve(typeof body === 'string' ? JSON.parse(body) : body),
        headers: new Headers(),
    } as Response;
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
});

function lastCallUrl(): string {
    return fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0];
}

function lastCallOptions(): RequestInit {
    return fetchMock.mock.calls[fetchMock.mock.calls.length - 1][1];
}

// ── getFilters ──────────────────────────────────────────────────

describe('getFilters', () => {
    it('returns parsed JSON response', async () => {
        const expected = { brands: ['Toyota', 'Honda'], body_types: ['sedan', 'suv'] };
        fetchMock.mockResolvedValueOnce(mockResponse(expected));

        const client = new Client('test-key');
        const result = await client.getFilters('encar');

        expect(result).toEqual(expected);
    });

    it('calls correct endpoint', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getFilters('encar');

        expect(lastCallUrl()).toContain('/api/v2/encar/filters');
    });

    it('includes api_key in query string', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('my-secret-key');
        await client.getFilters('encar');

        expect(lastCallUrl()).toContain('api_key=my-secret-key');
    });

    it('uses GET method', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getFilters('encar');

        expect(lastCallOptions().method).toBe('GET');
    });
});

// ── getOffers ───────────────────────────────────────────────────

describe('getOffers', () => {
    it('returns offers data', async () => {
        const expected = { data: [{ id: 1 }, { id: 2 }], total: 100 };
        fetchMock.mockResolvedValueOnce(mockResponse(expected));

        const client = new Client('test-key');
        const result = await client.getOffers('encar', { page: 1 });

        expect(result).toEqual(expected);
    });

    it('passes page parameter in query', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({ data: [] }));

        const client = new Client('test-key');
        await client.getOffers('encar', { page: 1 });

        expect(lastCallUrl()).toContain('page=1');
    });

    it('passes multiple filter parameters', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({ data: [] }));

        const client = new Client('test-key');
        await client.getOffers('mobile_de', {
            page: 2,
            brand: 'BMW',
            year_from: 2020,
            price_to: 50000,
        });

        const url = lastCallUrl();
        expect(url).toContain('brand=BMW');
        expect(url).toContain('year_from=2020');
        expect(url).toContain('price_to=50000');
        expect(url).toContain('page=2');
    });

    it('works without optional params', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({ data: [] }));

        const client = new Client('test-key');
        await client.getOffers('encar');

        expect(lastCallUrl()).toContain('/api/v2/encar/offers');
    });
});

// ── getOffer ────────────────────────────────────────────────────

describe('getOffer', () => {
    it('returns single offer data', async () => {
        const expected = { inner_id: 'abc123', brand: 'Toyota', price: 25000 };
        fetchMock.mockResolvedValueOnce(mockResponse(expected));

        const client = new Client('test-key');
        const result = await client.getOffer('encar', 'abc123');

        expect(result).toEqual(expected);
    });

    it('passes inner_id in query string', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getOffer('encar', 'abc123');

        expect(lastCallUrl()).toContain('inner_id=abc123');
    });
});

// ── getChangeId ─────────────────────────────────────────────────

describe('getChangeId', () => {
    it('returns numeric change_id', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({ change_id: 42567 }));

        const client = new Client('test-key');
        const result = await client.getChangeId('encar', '2024-01-15');

        expect(result).toBe(42567);
    });

    it('passes date parameter', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({ change_id: 0 }));

        const client = new Client('test-key');
        await client.getChangeId('encar', '2024-01-15');

        expect(lastCallUrl()).toContain('date=2024-01-15');
    });

    it('returns zero as valid value', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({ change_id: 0 }));

        const client = new Client('test-key');
        const result = await client.getChangeId('encar', '2024-01-01');

        expect(result).toBe(0);
    });
});

// ── getChanges ──────────────────────────────────────────────────

describe('getChanges', () => {
    it('returns changes feed', async () => {
        const expected = {
            added: [{ id: 'new1' }],
            changed: [{ id: 'upd1' }],
            removed: ['del1'],
        };
        fetchMock.mockResolvedValueOnce(mockResponse(expected));

        const client = new Client('test-key');
        const result = await client.getChanges('encar', 42567);

        expect(result).toEqual(expected);
    });

    it('passes change_id in query', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({ added: [] }));

        const client = new Client('test-key');
        await client.getChanges('encar', 42567);

        expect(lastCallUrl()).toContain('change_id=42567');
    });
});

// ── getOfferByUrl ───────────────────────────────────────────────

describe('getOfferByUrl', () => {
    it('returns offer data', async () => {
        const expected = { brand: 'BMW', model: 'X5', price: 45000 };
        fetchMock.mockResolvedValueOnce(mockResponse(expected));

        const client = new Client('test-key');
        const result = await client.getOfferByUrl('https://www.encar.com/dc/dc_cardetailview.do?pageid=1234');

        expect(result).toEqual(expected);
    });

    it('uses POST method', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getOfferByUrl('https://example.com/car/123');

        expect(lastCallOptions().method).toBe('POST');
    });

    it('uses v1 endpoint', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getOfferByUrl('https://example.com/car/123');

        expect(lastCallUrl()).toContain('/api/v1/offer/info');
    });

    it('sends api key in x-api-key header', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('header-key');
        await client.getOfferByUrl('https://example.com/car/123');

        const headers = lastCallOptions().headers as Record<string, string>;
        expect(headers['x-api-key']).toBe('header-key');
    });

    it('sends url in JSON body', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getOfferByUrl('https://example.com/car/123');

        const body = JSON.parse(lastCallOptions().body as string);
        expect(body.url).toBe('https://example.com/car/123');
    });

    it('sends Content-Type application/json', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getOfferByUrl('https://example.com/car/123');

        const headers = lastCallOptions().headers as Record<string, string>;
        expect(headers['Content-Type']).toBe('application/json');
    });

    it('does not include api_key in query string', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getOfferByUrl('https://example.com/car/123');

        expect(lastCallUrl()).not.toContain('api_key=');
    });
});

// ── Custom API version ──────────────────────────────────────────

describe('custom API version', () => {
    it('uses custom version in endpoint', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key', 'https://api1.auto-api.com', 'v3');
        await client.getFilters('encar');

        expect(lastCallUrl()).toContain('/api/v3/encar/filters');
    });
});

// ── Custom base URL ─────────────────────────────────────────────

describe('custom base URL', () => {
    it('uses custom base URL', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key', 'https://custom.api.com');
        await client.getFilters('encar');

        expect(lastCallUrl()).toMatch(/^https:\/\/custom\.api\.com\//);
    });

    it('strips trailing slashes from base URL', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key', 'https://custom.api.com///');
        await client.getFilters('encar');

        expect(lastCallUrl()).not.toContain('///');
        expect(lastCallUrl()).toMatch(/^https:\/\/custom\.api\.com\/api\//);
    });
});

// ── Error handling ──────────────────────────────────────────────

describe('error handling', () => {
    it('throws ApiError on server error', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ message: 'Internal server error' }, 500, 'Internal Server Error'),
        );

        const client = new Client('test-key');

        try {
            await client.getFilters('encar');
            expect.fail('Expected ApiError');
        } catch (e) {
            expect(e).toBeInstanceOf(ApiError);
            expect(e).not.toBeInstanceOf(AuthError);
        }
    });

    it('ApiError contains status code', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ message: 'Server error' }, 500, 'Internal Server Error'),
        );

        const client = new Client('test-key');

        try {
            await client.getFilters('encar');
            expect.fail('Expected ApiError');
        } catch (e) {
            expect(e).toBeInstanceOf(ApiError);
            expect((e as ApiError).statusCode).toBe(500);
        }
    });

    it('ApiError contains response body', async () => {
        const body = { message: 'Validation failed', errors: ['invalid page'] };
        fetchMock.mockResolvedValueOnce(mockResponse(body, 422, 'Unprocessable Entity'));

        const client = new Client('test-key');

        try {
            await client.getFilters('encar');
            expect.fail('Expected ApiError');
        } catch (e) {
            expect(e).toBeInstanceOf(ApiError);
            expect((e as ApiError).responseBody).toEqual(body);
        }
    });

    it('uses message field from response body', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ message: 'Custom error message' }, 500, 'Internal Server Error'),
        );

        const client = new Client('test-key');

        await expect(client.getFilters('encar')).rejects.toThrow('Custom error message');
    });

    it('falls back to default message when body has no message field', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ error: 'something' }, 500, 'Internal Server Error'),
        );

        const client = new Client('test-key');

        await expect(client.getFilters('encar')).rejects.toThrow('API error: 500 Internal Server Error');
    });

    it('throws AuthError on 401', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ message: 'Unauthorized' }, 401, 'Unauthorized'),
        );

        const client = new Client('test-key');

        await expect(client.getFilters('encar')).rejects.toThrow(AuthError);
    });

    it('throws AuthError on 403', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ message: 'Forbidden' }, 403, 'Forbidden'),
        );

        const client = new Client('test-key');

        await expect(client.getOffers('encar')).rejects.toThrow(AuthError);
    });

    it('AuthError is also an ApiError', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ message: 'Bad key' }, 401, 'Unauthorized'),
        );

        const client = new Client('test-key');

        await expect(client.getFilters('encar')).rejects.toThrow(ApiError);
    });

    it('throws ApiError on invalid JSON response', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse('not json at all'));

        const client = new Client('test-key');

        try {
            await client.getFilters('encar');
            expect.fail('Expected ApiError');
        } catch (e) {
            expect(e).toBeInstanceOf(ApiError);
            expect((e as ApiError).message).toContain('Invalid JSON response');
        }
    });

    it('throws ApiError on 404 (not AuthError)', async () => {
        fetchMock.mockResolvedValueOnce(
            mockResponse({ message: 'Source not found' }, 404, 'Not Found'),
        );

        const client = new Client('test-key');

        try {
            await client.getFilters('unknown_source');
            expect.fail('Expected ApiError');
        } catch (e) {
            expect(e).toBeInstanceOf(ApiError);
            expect(e).not.toBeInstanceOf(AuthError);
            expect((e as ApiError).statusCode).toBe(404);
        }
    });
});

// ── Timeout ─────────────────────────────────────────────────────

describe('timeout', () => {
    it('passes AbortSignal with timeout to fetch', async () => {
        fetchMock.mockResolvedValueOnce(mockResponse({}));

        const client = new Client('test-key');
        await client.getFilters('encar');

        const options = lastCallOptions();
        expect(options.signal).toBeDefined();
    });
});
