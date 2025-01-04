import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {AuthContextType, User} from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [token, setToken] = useState<string | null>(() => {
        const storedToken = localStorage.getItem('token');
        console.log('Initial token from localStorage:', storedToken ? 'Present' : 'Not present');
        return storedToken;
    });
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserInfo = async (authToken: string) => {
        console.log('Fetching user info with token');
        try {
            const response = await fetch('https://api.algorithm-challenge.com/user/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('User data received:', userData);
                setUser(userData);
            } else {
                console.error('Failed to fetch user info:', response.status);
                logout();
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Token changed:', token ? 'Present' : 'Not present');
        if (token) {
            void fetchUserInfo(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleAuthentication = (newToken: string): void => {
        console.log('Handling authentication with new token');
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const login = (): void => {
        console.log('Initiating login redirect');
        window.location.href = 'https://api.algorithm-challenge.com/oauth2/authorization/google';
    };

    const logout = (): void => {
        console.log('Logging out');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            handleAuthentication
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;