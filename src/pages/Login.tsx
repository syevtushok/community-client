import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {LoginButton} from "../components/login/LoginButton";
import {APP_NAME, AUTH_REDIRECT_PATH, CHALLENGE_TEXT} from "../config/constants";

export const Login = () => {
    const {login, user, loading} = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user && !loading) {
            navigate(AUTH_REDIRECT_PATH);
        }
    }, [user, navigate, loading]);

    const handleLogin = async () => {
        try {
            setError("");
            setIsLoading(true);
            await login();
        } catch (error) {
            console.error('Login failed:', error);
            setError("Login failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950">
            <div className="w-full max-w-md space-y-8 p-10 rounded-xl bg-gray-900 shadow-2xl border border-gray-800">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                            Sign in to {APP_NAME}
                        </h2>
                        <p className="text-center text-sm text-gray-400">
                            {CHALLENGE_TEXT}
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 text-sm text-red-400 bg-red-900/20 rounded-lg border border-red-800">
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <LoginButton
                            isLoading={isLoading}
                            onClick={handleLogin}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};