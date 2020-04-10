import fetch, { Response } from 'node-fetch';
import { Logger } from './Logger';

export const enum APIMethods {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export type KeyValue<T, U> = {
    key: T;
    value: U;
};

export class APIRequester {
    private url: string;
    private headers: string[][];
    private method: string;
    private body: string | undefined;
    private responsePlainText: string | undefined;
    private STATUS_CODE: number | undefined;
    private SUCCESS = false;
    private requestPromise: Promise<Response> | null = null;

    constructor(initialData: { url: string }) {
        this.url = initialData.url;
        this.headers = [];
        this.method = '';
    }

    /**
     * Adds headers to request
     * @param headers - Array of headers
     */
    setHeaders(headers: KeyValue<string, string>[]): APIRequester {
        for (const i in headers) {
            if (headers[i].hasOwnProperty('key') && headers[i].hasOwnProperty('value')) {
                this.headers.push([headers[i].key, headers[i].value]);
            }
        }
        return this;
    }

    /**
     * Add method to request
     * @param newMethod - REST method
     */
    setMethod(newMethod: APIMethods): APIRequester {
        this.method = newMethod;
        return this;
    }

    /**
     * Make request
     * @param body - Key value pairs to send in body
     */
    request<T>(body: T): APIRequester {
        this.body = JSON.stringify(body);
        this.requestPromise = fetch(this.url, {
            headers: this.headers,
            method: this.method,
            body: this.method === 'GET' ? undefined : JSON.stringify(body),
        });
        return this;
    }

    /**
     * Extract and return response body in JSON format
     */
    async json<T>(): Promise<T> {
        try {
            const res: Response | null = await this.requestPromise;

            if (res === null)
                // When response is empty
                throw new Error('fetch init failed');

            this.STATUS_CODE = res.status;
            this.responsePlainText = await res.text();

            if (this.STATUS_CODE !== 200)
                // When request is not successful
                throw new Error('Request status code not 200');

            this.SUCCESS = true;

            return (await JSON.parse(this.responsePlainText)) as T;
        } catch (err) {
            return this.handleError<T>(err);
        }
    }

    get statusCode() {
        return this.STATUS_CODE;
    }

    get success() {
        return this.SUCCESS;
    }

    /**
     * Logs error and throws new error message for global error handle
     * @param err - Request error
     */
    handleError<T>(err: Error): Promise<T> {
        Logger.error('URL: ' + this.url);
        Logger.error('Method: ' + this.method);
        Logger.error('Headers: ' + JSON.stringify(this.headers));
        //Logger.error('Body: ' + this.body);
        Logger.error('Status code: ' + this.STATUS_CODE);
        Logger.error('Plain text response: ' + this.responsePlainText);
        Logger.error('Request to remote service could not be made: ' + err.message);
        throw err;
    }
}

export class RequestBody<T> {
    constructor(private body: T) {}

    get requestBody(): T {
        return this.body;
    }

    set requestBody(newRequestBody: T) {
        this.body = newRequestBody;
    }
}
