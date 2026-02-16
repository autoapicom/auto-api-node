import { ApiError, AuthError } from './errors.js';

export class Client {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly apiVersion: string;
    private readonly timeout: number;

    constructor(apiKey: string, baseUrl: string = 'https://api1.auto-api.com', apiVersion: string = 'v2') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.apiVersion = apiVersion;
        this.timeout = 30000;
    }

    /**
     * Available filters for a source (brands, models, body types, etc.)
     */
    async getFilters(source: string): Promise<Record<string, unknown>> {
        return this.get(`api/${this.apiVersion}/${source}/filters`);
    }

    /**
     * List of offers with pagination and filters.
     *
     * Params: page (required), brand, model, configuration, complectation,
     * transmission, color, body_type, engine_type, year_from, year_to,
     * mileage_from, mileage_to, price_from, price_to
     */
    async getOffers(source: string, params: Record<string, string | number> = {}): Promise<Record<string, unknown>> {
        return this.get(`api/${this.apiVersion}/${source}/offers`, params);
    }

    /**
     * Single offer by inner_id.
     */
    async getOffer(source: string, innerId: string): Promise<Record<string, unknown>> {
        return this.get(`api/${this.apiVersion}/${source}/offer`, { inner_id: innerId });
    }

    /**
     * Get change_id by date (format: yyyy-mm-dd).
     */
    async getChangeId(source: string, date: string): Promise<number> {
        const response = await this.get(`api/${this.apiVersion}/${source}/change_id`, { date });
        return response.change_id as number;
    }

    /**
     * Changes feed (added/changed/removed) starting from change_id.
     */
    async getChanges(source: string, changeId: number): Promise<Record<string, unknown>> {
        return this.get(`api/${this.apiVersion}/${source}/changes`, { change_id: changeId });
    }

    /**
     * Get offer data by its URL on the marketplace.
     */
    async getOfferByUrl(url: string): Promise<Record<string, unknown>> {
        return this.post('api/v1/offer/info', { url });
    }

    private async get(endpoint: string, params: Record<string, string | number> = {}): Promise<Record<string, unknown>> {
        const query = new URLSearchParams();
        query.set('api_key', this.apiKey);
        for (const [key, value] of Object.entries(params)) {
            query.set(key, String(value));
        }

        const url = `${this.baseUrl}/${endpoint}?${query.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return this.decode(response);
    }

    private async post(endpoint: string, data: Record<string, string>): Promise<Record<string, unknown>> {
        const url = `${this.baseUrl}/${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout),
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return this.decode(response);
    }

    private async decode(response: Response): Promise<Record<string, unknown>> {
        const text = await response.text();

        try {
            return JSON.parse(text);
        } catch {
            throw new ApiError(`Invalid JSON response: ${text.slice(0, 200)}`, response.status);
        }
    }

    private async handleError(response: Response): Promise<never> {
        let body: unknown;
        let message = `API error: ${response.status} ${response.statusText}`;

        try {
            body = await response.json();
            if (body && typeof body === 'object' && 'message' in body) {
                message = (body as Record<string, string>).message;
            }
        } catch {
            // Response body is not JSON
        }

        if (response.status === 401 || response.status === 403) {
            throw new AuthError(message, response.status);
        }

        throw new ApiError(message, response.status, body);
    }
}
