import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    background: '#f9f9f9',
    text: '#333333',
    primary: '#2196f3',
    secondary: '#f5f5f5',
    accent: '#ff5722',
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    name: 'dark',
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#64b5f6',
    secondary: '#333333',
    accent: '#ff7043',
    border: '#404040',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? themes.dark : themes.light;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme.name);
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;

    // Update CSS variables
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => 
      prevTheme.name === 'light' ? themes.dark : themes.light
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 