interface Claims {
    name: string;
    picture?: string;
}

export interface User {
    email: string;
    subject: string;
    claims: Claims;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
    handleAuthentication: (token: string) => void;
}
