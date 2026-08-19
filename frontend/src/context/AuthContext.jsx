import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firebaseConfig, setFirebaseConfig] = useState(null);
    const [razorpayKeyId, setRazorpayKeyId] = useState('');

    const fetchCurrentUser = async () => {
        try {
            const res = await axios.get('/api/auth/current-user');
            if (res.data.success) {
                setUser(res.data.user);
                setFirebaseConfig(res.data.firebaseConfig);
                setRazorpayKeyId(res.data.razorpayKeyId);

                // Initialize Firebase if config exists
                if (res.data.firebaseConfig && res.data.firebaseConfig.apiKey) {
                    if (!getApps().length) {
                        try {
                            initializeApp(res.data.firebaseConfig);
                        } catch (e) {
                            console.error('Firebase init error:', e);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch auth session:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (usernameOrEmail, password) => {
        const res = await axios.post('/api/auth/login', { username: usernameOrEmail, password });
        if (res.data.success) {
            setUser(res.data.user);
        }
        return res.data;
    };

    const signup = async (username, email, password) => {
        const res = await axios.post('/api/auth/signup', { username, email, password });
        if (res.data.success) {
            setUser(res.data.user);
        }
        return res.data;
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            const result = await signInWithPopup(auth, provider);
            const fbUser = result.user;

            const res = await axios.post('/api/auth/firebase-google', {
                email: fbUser.email,
                displayName: fbUser.displayName,
                photoURL: fbUser.photoURL,
                uid: fbUser.uid
            });

            if (res.data.success) {
                setUser(res.data.user);
            }
            return res.data;
        } catch (err) {
            console.error('Google sign-in error:', err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout,
            signInWithGoogle,
            firebaseConfig,
            razorpayKeyId,
            refreshUser: fetchCurrentUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
