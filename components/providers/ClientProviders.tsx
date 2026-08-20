'use client';

import React from 'react';
import { ToastProvider } from '../ui/Toast';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from '../auth/AuthContext';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

