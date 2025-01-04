import { TOKEN_KEY } from '../config/constants';

export const getAuthToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const createAuthHeader = (token?: string): Record<string, string> => {
    const authToken = token || getAuthToken();
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
};
