import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  orange: {
    name: 'Sunset Orange',
    primary: '#ff6b35',
    secondary: '#f7931e',
    accent: '#ff4d2d',
    gradient: 'from-orange-400 to-red-500',
    light: {
      bg: 'bg-gradient-to-br from-orange-50 to-white',
      card: 'bg-white',
      text: 'text-gray-800',
      textMuted: 'text-gray-600',
      border: 'border-orange-200',
      button: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
      buttonSecondary: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      input: 'border-orange-200 focus:border-orange-500 focus:ring-orange-500',
      nav: 'bg-white/80 backdrop-blur-md border-b border-orange-100',
      shadow: 'shadow-orange-500/20',
      icon: 'text-orange-500',
      badge: 'bg-orange-100 text-orange-700',
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-orange-900/20 to-black',
      card: 'bg-gray-800/90 backdrop-blur-md',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      border: 'border-orange-700/50',
      button: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400',
      buttonSecondary: 'bg-orange-900/50 text-orange-300 hover:bg-orange-800/50',
      input: 'bg-gray-700 border-orange-600/50 focus:border-orange-400 focus:ring-orange-400 text-white',
      nav: 'bg-gray-900/80 backdrop-blur-md border-b border-orange-800/50',
      shadow: 'shadow-orange-500/30',
      icon: 'text-orange-400',
      badge: 'bg-orange-900/50 text-orange-300',
    }
  },
  blue: {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#06b6d4',
    accent: '#2563eb',
    gradient: 'from-blue-400 to-cyan-500',
    light: {
      bg: 'bg-gradient-to-br from-blue-50 to-white',
      card: 'bg-white',
      text: 'text-gray-800',
      textMuted: 'text-gray-600',
      border: 'border-blue-200',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      buttonSecondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      input: 'border-blue-200 focus:border-blue-500 focus:ring-blue-500',
      nav: 'bg-white/80 backdrop-blur-md border-b border-blue-100',
      shadow: 'shadow-blue-500/20',
      icon: 'text-blue-500',
      badge: 'bg-blue-100 text-blue-700',
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-black',
      card: 'bg-gray-800/90 backdrop-blur-md',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      border: 'border-blue-700/50',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400',
      buttonSecondary: 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50',
      input: 'bg-gray-700 border-blue-600/50 focus:border-blue-400 focus:ring-blue-400 text-white',
      nav: 'bg-gray-900/80 backdrop-blur-md border-b border-blue-800/50',
      shadow: 'shadow-blue-500/30',
      icon: 'text-blue-400',
      badge: 'bg-blue-900/50 text-blue-300',
    }
  },
  green: {
    name: 'Forest Green',
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#059669',
    gradient: 'from-emerald-400 to-green-500',
    light: {
      bg: 'bg-gradient-to-br from-emerald-50 to-white',
      card: 'bg-white',
      text: 'text-gray-800',
      textMuted: 'text-gray-600',
      border: 'border-emerald-200',
      button: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600',
      buttonSecondary: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
      input: 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500',
      nav: 'bg-white/80 backdrop-blur-md border-b border-emerald-100',
      shadow: 'shadow-emerald-500/20',
      icon: 'text-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-emerald-900/20 to-black',
      card: 'bg-gray-800/90 backdrop-blur-md',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      border: 'border-emerald-700/50',
      button: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400',
      buttonSecondary: 'bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50',
      input: 'bg-gray-700 border-emerald-600/50 focus:border-emerald-400 focus:ring-emerald-400 text-white',
      nav: 'bg-gray-900/80 backdrop-blur-md border-b border-emerald-800/50',
      shadow: 'shadow-emerald-500/30',
      icon: 'text-emerald-400',
      badge: 'bg-emerald-900/50 text-emerald-300',
    }
  },
  purple: {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#7c3aed',
    gradient: 'from-violet-400 to-purple-500',
    light: {
      bg: 'bg-gradient-to-br from-violet-50 to-white',
      card: 'bg-white',
      text: 'text-gray-800',
      textMuted: 'text-gray-600',
      border: 'border-violet-200',
      button: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600',
      buttonSecondary: 'bg-violet-100 text-violet-700 hover:bg-violet-200',
      input: 'border-violet-200 focus:border-violet-500 focus:ring-violet-500',
      nav: 'bg-white/80 backdrop-blur-md border-b border-violet-100',
      shadow: 'shadow-violet-500/20',
      icon: 'text-violet-500',
      badge: 'bg-violet-100 text-violet-700',
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-violet-900/20 to-black',
      card: 'bg-gray-800/90 backdrop-blur-md',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      border: 'border-violet-700/50',
      button: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400',
      buttonSecondary: 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50',
      input: 'bg-gray-700 border-violet-600/50 focus:border-violet-400 focus:ring-violet-400 text-white',
      nav: 'bg-gray-900/80 backdrop-blur-md border-b border-violet-800/50',
      shadow: 'shadow-violet-500/30',
      icon: 'text-violet-400',
      badge: 'bg-violet-900/50 text-violet-300',
    }
  },
  pink: {
    name: 'Rose Pink',
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#db2777',
    gradient: 'from-pink-400 to-rose-500',
    light: {
      bg: 'bg-gradient-to-br from-pink-50 to-white',
      card: 'bg-white',
      text: 'text-gray-800',
      textMuted: 'text-gray-600',
      border: 'border-pink-200',
      button: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
      buttonSecondary: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
      input: 'border-pink-200 focus:border-pink-500 focus:ring-pink-500',
      nav: 'bg-white/80 backdrop-blur-md border-b border-pink-100',
      shadow: 'shadow-pink-500/20',
      icon: 'text-pink-500',
      badge: 'bg-pink-100 text-pink-700',
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-pink-900/20 to-black',
      card: 'bg-gray-800/90 backdrop-blur-md',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      border: 'border-pink-700/50',
      button: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400',
      buttonSecondary: 'bg-pink-900/50 text-pink-300 hover:bg-pink-800/50',
      input: 'bg-gray-700 border-pink-600/50 focus:border-pink-400 focus:ring-pink-400 text-white',
      nav: 'bg-gray-900/80 backdrop-blur-md border-b border-pink-800/50',
      shadow: 'shadow-pink-500/30',
      icon: 'text-pink-400',
      badge: 'bg-pink-900/50 text-pink-300',
    }
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'orange';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme, isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const theme = themes[currentTheme];
  const currentMode = isDarkMode ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentTheme, 
      setTheme, 
      isDarkMode, 
      toggleDarkMode,
      currentMode,
      themes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
