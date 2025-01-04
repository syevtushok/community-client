import {ApiError} from '../types/api.types';

export class HttpError extends Error implements ApiError {
    constructor(
        public status: number,
        message?: string,
        public data?: any
    ) {
        super(message || `HTTP error! status: ${status}`);
        this.name = 'HttpError';
    }
}

export const handleApiError = (error: Error): never => {
    console.error('API Error:', error);
    throw error;
};
