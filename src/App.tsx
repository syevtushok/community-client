import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {Login} from './pages/Login.tsx';
import {OAuth2RedirectHandler} from './pages/OAuth2RedirectHandler.tsx';
import {ProtectedRoute} from './pages/ProtectedRoute.tsx';
import {AuthRedirect} from "./pages/AuthRedirect.tsx";
import {JoinChallenge} from "./pages/JoinChallenge.tsx";
import Dashboard from "./pages/Dashboard.tsx"
import './index.css';

export const App: React.FC = () => {
    return (
        <div className="dark">
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
                        <Route
                            path="/auth-redirect"
                            element={
                                <ProtectedRoute>
                                    <AuthRedirect/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/join"
                            element={
                                <ProtectedRoute>
                                    <JoinChallenge/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard/>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </div>
    );
};

