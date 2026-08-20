'use client';

import React from 'react';
import { ConnectorId } from './types';
import { cn } from '../../lib/utils';

export interface ConnectorIconProps {
  id: ConnectorId;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConnectorIcon: React.FC<ConnectorIconProps> = ({ id, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSize = className || sizeClasses[size];

  switch (id) {
    case 'gmail':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="none">
          <path
            d="M1.5 17.5V6.5C1.5 5.39543 2.39543 4.5 3.5 4.5H20.5C21.6046 4.5 22.5 5.39543 22.5 6.5V17.5C22.5 18.6046 21.6046 19.5 20.5 19.5H3.5C2.39543 19.5 1.5 18.6046 1.5 17.5Z"
            fill="#F2F2F2"
          />
          <path
            d="M1.5 6.5L12 13.5L22.5 6.5V17.5C22.5 18.6046 21.6046 19.5 20.5 19.5H3.5C2.39543 19.5 1.5 18.6046 1.5 17.5V6.5Z"
            fill="#EA4335"
            fillOpacity="0.1"
          />
          <path
            d="M20.5 4.5H18.5V12.5L12 8L5.5 12.5V4.5H3.5C2.39543 4.5 1.5 5.39543 1.5 6.5V17.5C1.5 18.6046 2.39543 19.5 3.5 19.5H5.5V10.5L12 15L18.5 10.5V19.5H20.5C21.6046 19.5 22.5 18.6046 22.5 17.5V6.5C22.5 5.39543 21.6046 4.5 20.5 4.5Z"
            fill="#EA4335"
          />
        </svg>
      );

    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="none">
          <rect x="2.5" y="4" width="19" height="17" rx="3.5" fill="#1A73E8" />
          <path d="M7 2v4M17 2v4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <rect x="2.5" y="9" width="19" height="12" fill="#FFFFFF" rx="1" />
          <text x="12" y="17.5" textAnchor="middle" fill="#1A73E8" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
            31
          </text>
        </svg>
      );

    case 'drive':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="none">
          <path d="M8.2 3.5H15.8L22 14.5H14.4L8.2 3.5Z" fill="#FFC107" />
          <path d="M1.8 14.5L5 9H20.2L17 14.5H1.8Z" fill="#1976D2" />
          <path d="M8.2 3.5L2 14.5L5.1 20H11.3L8.2 3.5Z" fill="#4CAF50" />
        </svg>
      );

    case 'notion':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="none">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#000000" />
          <path
            d="M7.5 7.5L10 8V16L8 16.5V9.5L7.5 9.5V7.5ZM16.5 7.5L16.5 16L14.5 16.5L11.5 11.5V16L9.5 16.5V8.5L11.5 8L14.5 13V8L16.5 7.5Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'github':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );

    case 'slack':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="none">
          <path d="M6 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 2 2V13H7v2zm0-6a2 2 0 1 1-2-2v2h2zm0 1a2 2 0 1 1 2-2H7v2zm6-4a2 2 0 1 1 2 2h-2V6zm-1 0a2 2 0 1 1-2-2v2h2zm0 6a2 2 0 1 1 2 2V12h-2zm0-1a2 2 0 1 1-2 2h2v-2z" fill="#4A154B" />
        </svg>
      );

    case 'outlook':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="none">
          <rect x="3" y="4" width="18" height="16" rx="3" fill="#0078D4" />
          <path d="M12 12.5L3 6v12h18V6l-9 6.5z" fill="#FFFFFF" fillOpacity="0.8" />
        </svg>
      );

    case 'onedrive':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="none">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#0078D4" />
        </svg>
      );

    case 'dropbox':
      return (
        <svg viewBox="0 0 24 24" className={cn(iconSize, 'shrink-0')} fill="#0061FF">
          <path d="M6 3l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 15l6 4 6-4-6-4-6 4zm24 0l-6-4-6 4 6 4 6-4zM6 20l6 3.5L18 20l-6-4-6 4z" />
        </svg>
      );

    default:
      return null;
  }
};
