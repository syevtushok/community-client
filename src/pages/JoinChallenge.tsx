import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from "../services/api.service";

interface NameCheckResponse {
    available: boolean;
}

export const JoinChallenge: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [preferredName, setPreferredName] = useState(user?.claims.name || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAvailable, setIsAvailable] = useState(true);

    const checkNameAvailability = async (name: string) => {
        try {
            const result = await api.get(`/participants/check-name?name=${encodeURIComponent(name)}`);
            const response = result as unknown as NameCheckResponse;
            setIsAvailable(response.available);
            if (!response.available) {
                setError('This name is already taken. Please choose another one.');
            } else {
                setError(null);
            }
        } catch (error) {
            console.error('Failed to check name availability:', error);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setPreferredName(newName);
        if (newName.length >= 3) {
            void checkNameAvailability(newName);
        } else {
            setIsAvailable(true);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAvailable) {
            setError('Please choose a different name.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('/participants/join', { preferredName });
            navigate('/dashboard');
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('This name is already taken. Please choose another one.');
            } else {
                setError('Failed to join the challenge. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Join the Algorithm Challenge
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    100 days of consistent practice to master algorithms
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-900 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Your name in the challenge
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={preferredName}
                                    onChange={handleNameChange}
                                    className={`appearance-none block w-full px-3 py-2 border 
                                    ${isAvailable ? 'border-gray-700' : 'border-red-500'} 
                                    rounded-md shadow-sm placeholder-gray-500 
                                    bg-gray-800 text-white
                                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                    sm:text-sm`}
                                />
                                {preferredName.length >= 3 && (
                                    <div className="absolute right-2 top-2">
                                        {isAvailable ? (
                                            <span className="text-green-500 text-sm">✓ Available</span>
                                        ) : (
                                            <span className="text-red-500 text-sm">✗ Taken</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md border border-red-800">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading || !isAvailable}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent 
                                rounded-md shadow-sm text-sm font-medium text-white 
                                bg-blue-600 hover:bg-blue-700 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                ${(loading || !isAvailable) ? 'opacity-50 cursor-not-allowed bg-blue-800' : ''}`}
                            >
                                {loading ? 'Joining...' : 'Join Challenge'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};