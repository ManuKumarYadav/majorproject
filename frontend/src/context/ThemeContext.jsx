import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('stayaira-theme') || 
               localStorage.getItem('rentrova-theme') || 
               'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        localStorage.setItem('stayaira-theme', theme);

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark-theme');
        } else if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
            root.classList.remove('dark-theme');
        } else {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
            if (systemDark) root.classList.add('dark-theme');
            else root.classList.remove('dark-theme');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
