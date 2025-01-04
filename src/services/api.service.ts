import {FetchOptions} from '../types/api.types';
import {API_BASE_URL, AUTH_ROUTES} from '../config/constants';
import {clearAuthToken, createAuthHeader} from '../utils/auth';
import {handleApiError, HttpError} from '../utils/error';

class ApiService {
    private readonly baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private handleUnauthorized(): never {
        clearAuthToken();
        window.location.href = AUTH_ROUTES.LOGIN;
        throw new HttpError(401, 'Unauthorized');
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            return this.handleUnauthorized();
        }

        if (!response.ok) {
            const errorData = await response.json().catch((error) => console.error('Error parsing error response:', error));
            throw new HttpError(response.status, undefined, errorData);
        }

        return response.json();
    }

    public async fetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
        try {
            const headers = {
                ...options.headers,
                ...createAuthHeader()
            };

            const response = await fetch(`${this.baseUrl}${url}`, {
                ...options,
                headers
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            return handleApiError(error as Error);
        }
    }

    // Convenience methods for common HTTP methods
    public async get<T>(url: string, options: Omit<FetchOptions, 'method'> = {}): Promise<T> {
        return this.fetch<T>(url, {...options, method: 'GET'});
    }

    public async post<T>(url: string, data?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }

    public async put<T>(url: string, data?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }

    public async delete<T>(url: string, options: Omit<FetchOptions, 'method'> = {}): Promise<T> {
        return this.fetch<T>(url, {...options, method: 'DELETE'});
    }
}

export const api = new ApiService();
