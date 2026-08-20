'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ThemeOption,
  getStoredSettings,
  subscribeToSettings,
  updateSettings,
} from '../../services/settings/settingsService';

export type ThemeMode = ThemeOption;

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return getStoredSettings().theme || 'dark';
  });

  // Reactively sync with settingsService
  useEffect(() => {
    const unsubscribe = subscribeToSettings((settings) => {
      setThemeState(settings.theme || 'dark');
    });
    return () => unsubscribe();
  }, []);

  // Compute effective dark / light
  const effectiveTheme: 'dark' | 'light' = React.useMemo(() => {
    if (theme === 'auto') {
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return theme === 'light' ? 'light' : 'dark';
  }, [theme]);

  // Apply CSS class to root element
  useEffect(() => {
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    updateSettings({ theme: newTheme });
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const isDark = effectiveTheme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark' as ThemeMode,
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: true,
    };
  }
  return context;
};


