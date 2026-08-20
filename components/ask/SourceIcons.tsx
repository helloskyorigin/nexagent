'use client';

import React from 'react';
import { ConnectorType } from './types';

export interface SourceIconProps {
  type: ConnectorType | string;
  className?: string;
}

export const SourceIcon: React.FC<SourceIconProps> = ({ type, className = 'h-3.5 w-3.5' }) => {
  switch (type.toLowerCase()) {
    case 'gmail':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            fill="#EA4335"
          />
          <path
            d="M22 6l-10 7L2 6"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 18V6l10 7 10-7v12H2z"
            fill="#ffffff"
            fillOpacity="0.2"
          />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="3" fill="#4285F4" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <text
            x="12"
            y="17"
            fill="#ffffff"
            fontSize="7.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            31
          </text>
        </svg>
      );
    case 'drive':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M8.2 4h7.6l6.2 10.7-3.8 6.5H10.6L8.2 4z" fill="#0F9D58" />
          <path d="M1.8 15.2l3.8-6.5h14.6l-3.8 6.5H1.8z" fill="#FFBA00" />
          <path d="M8.2 4L4.4 10.5 1.8 15.2 5.6 21.2h7.6L8.2 4z" fill="#4285F4" />
        </svg>
      );
    case 'notion':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5v-15zM7.5 6v12h2.2l4.8-7.5V18h2V6h-2.2L9.5 13.5V6h-2z" />
        </svg>
      );
    case 'github':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      );
    case 'slack':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A" />
        </svg>
      );
    case 'linear':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#5E6AD2" />
        </svg>
      );
    default:
      return null;
  }
};
