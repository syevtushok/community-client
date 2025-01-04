import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.tsx';
import {api} from "../services/api.service.ts";//++

export const AuthRedirect: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkParticipant = async () => {
            try {
                const {exists} = await api.get<{ exists: boolean }>('/participants/check');//++
                navigate(exists ? '/' : '/join');
            } catch (error) {
                console.error('Error checking participant:', error);
                navigate('/error');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            void checkParticipant();
        }
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return null;
};