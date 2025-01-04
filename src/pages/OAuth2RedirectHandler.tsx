import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.tsx';

export const OAuth2RedirectHandler: React.FC = () => {
    const {handleAuthentication} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            handleAuthentication(token);
            navigate('/auth-redirect');
        } else {
            navigate('/login');
        }
    }, [location, handleAuthentication, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};