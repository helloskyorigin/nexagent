'use client';

import React from 'react';

export const GmailIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z"
      fill="#F2F2F2"
    />
    <path
      d="M20 4H18V12L12 7.5L6 12V4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H6V10.5L12 15L18 10.5V20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
      fill="#EA4335"
    />
    <path d="M6 20H4C2.9 20 2 19.1 2 18V6.5L6 9.5V20Z" fill="#C5221F" />
    <path d="M18 20H20C21.1 20 22 19.1 22 18V6.5L18 9.5V20Z" fill="#C5221F" />
    <path d="M18 4L12 8.5L6 4H4L12 10L20 4H18Z" fill="#EA4335" />
    <path d="M2 6.5V6C2 4.9 2.9 4 4 4H6L2 7V6.5Z" fill="#BB001B" />
    <path d="M22 6.5V6C22 4.9 21.1 4 20 4H18L22 7V6.5Z" fill="#BB001B" />
    <path d="M6 4V9.5L2 6.5L6 4Z" fill="#4285F4" />
    <path d="M18 4V9.5L22 6.5L18 4Z" fill="#FBBC05" />
    <path d="M2 18V18C2 19.1 2.9 20 4 20H6V10.5L2 7.5V18Z" fill="#34A853" />
  </svg>
);

export const GoogleDriveIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M8.6 3.5H15.4L22 15H15.2L8.6 3.5Z" fill="#FFC107" />
    <path d="M2 15L5.4 9.1L12.1 20.6H5.3L2 15Z" fill="#2196F3" />
    <path d="M8.6 15H22L18.6 20.6H5.3L8.6 15Z" fill="#4CAF50" />
  </svg>
);

export const GoogleCalendarIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="17" rx="3" fill="#1A73E8" />
    <path d="M3 8.5H21V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8.5Z" fill="#FFFFFF" />
    <path d="M7 2V5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 2V5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" />
    <text
      x="12"
      y="16.5"
      textAnchor="middle"
      fill="#1A73E8"
      fontSize="8.5"
      fontWeight="bold"
      fontFamily="system-ui, sans-serif"
    >
      31
    </text>
  </svg>
);

export const NotionIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#FFFFFF" />
    <path
      d="M6.3 5.4C6.8 5.8 7 6.3 7 7.1V16.7C7 17.5 6.7 18 6.1 18.4L5 19.1V19.8H10.1V19.1L9 18.4C8.4 18 8.2 17.5 8.2 16.7V9.3L14.7 19.8H18.5V7.1C18.5 6.3 18.8 5.8 19.4 5.4L20.5 4.7V4H15.8V4.7L16.8 5.4C17.4 5.8 17.6 6.3 17.6 7.1V14.2L11.5 4H7.8V4.7L6.3 5.4Z"
      fill="#000000"
    />
  </svg>
);

export const SlackIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M5.04 14.28C5.04 15.6 3.96 16.68 2.64 16.68C1.32 16.68 0.24 15.6 0.24 14.28C0.24 12.96 1.32 11.88 2.64 11.88H5.04V14.28Z"
      fill="#E01E5A"
    />
    <path
      d="M6.24 14.28C6.24 12.96 7.32 11.88 8.64 11.88C9.96 11.88 11.04 12.96 11.04 14.28V19.08C11.04 20.4 9.96 21.48 8.64 21.48C7.32 21.48 6.24 20.4 6.24 19.08V14.28Z"
      fill="#E01E5A"
    />
    <path
      d="M9.72 5.04C8.4 5.04 7.32 3.96 7.32 2.64C7.32 1.32 8.4 0.24 9.72 0.24C11.04 0.24 12.12 1.32 12.12 2.64V5.04H9.72Z"
      fill="#36C5F0"
    />
    <path
      d="M9.72 6.24C11.04 6.24 12.12 7.32 12.12 8.64C12.12 9.96 11.04 11.04 9.72 11.04H4.92C3.6 11.04 2.52 9.96 2.52 8.64C2.52 7.32 3.6 6.24 4.92 6.24H9.72Z"
      fill="#36C5F0"
    />
    <path
      d="M18.96 9.72C18.96 8.4 20.04 7.32 21.36 7.32C22.68 7.32 23.76 8.4 23.76 9.72C23.76 11.04 22.68 12.12 21.36 12.12H18.96V9.72Z"
      fill="#2EB67D"
    />
    <path
      d="M17.76 9.72C17.76 11.04 16.68 12.12 15.36 12.12C14.04 12.12 12.96 11.04 12.96 9.72V4.92C12.96 3.6 14.04 2.52 15.36 2.52C16.68 2.52 17.76 3.6 17.76 4.92V9.72Z"
      fill="#2EB67D"
    />
    <path
      d="M14.28 18.96C15.6 18.96 16.68 20.04 16.68 21.36C16.68 22.68 15.6 23.76 14.28 23.76C12.96 23.76 11.88 22.68 11.88 21.36V18.96H14.28Z"
      fill="#ECB22E"
    />
    <path
      d="M14.28 17.76C12.96 17.76 11.88 16.68 11.88 15.36C11.88 14.04 12.96 12.96 14.28 12.96H19.08C20.4 12.96 21.48 14.04 21.48 15.36C21.48 16.68 20.4 17.76 19.08 17.76H14.28Z"
      fill="#ECB22E"
    />
  </svg>
);

export const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017C2 16.446 4.87 20.198 8.84 21.523C9.34 21.616 9.52 21.306 9.52 21.042C9.52 20.806 9.51 20.032 9.51 19.198C6.73 19.803 6.14 17.86 6.14 17.86C5.68 16.69 5.03 16.38 5.03 16.38C4.12 15.76 5.1 15.77 5.1 15.77C6.1 15.84 6.63 16.8 6.63 16.8C7.52 18.33 8.97 17.89 9.54 17.63C9.63 16.98 9.89 16.54 10.17 16.29C7.95 16.04 5.62 15.18 5.62 11.36C5.62 10.27 6.01 9.38 6.65 8.68C6.55 8.43 6.21 7.41 6.75 6.05C6.75 6.05 7.59 5.78 9.5 7.07C10.3 6.85 11.15 6.74 12 6.74C12.85 6.74 13.7 6.85 14.5 7.07C16.41 5.78 17.25 6.05 17.25 6.05C17.79 7.41 17.45 8.43 17.35 8.68C17.99 9.38 18.38 10.27 18.38 11.36C18.38 15.19 16.04 16.03 13.81 16.28C14.17 16.59 14.49 17.2 14.49 18.14C14.49 19.49 14.48 20.57 14.48 20.9C14.48 21.17 14.66 21.48 15.17 21.38C19.14 20.05 22 16.36 22 12.017C22 6.484 17.522 2 12 2Z"
    />
  </svg>
);

export const PluginPlugIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-5" />
    <path d="M9 8V2" />
    <path d="M15 8V2" />
    <path d="M18 8v5a6 6 0 0 1-12 0V8z" />
  </svg>
);

export const getPluginIcon = (id: string, className = 'h-7 w-7') => {
  switch (id) {
    case 'gmail':
      return <GmailIcon className={className} />;
    case 'drive':
      return <GoogleDriveIcon className={className} />;
    case 'calendar':
      return <GoogleCalendarIcon className={className} />;
    case 'notion':
      return <NotionIcon className={className} />;
    case 'slack':
      return <SlackIcon className={className} />;
    case 'github':
      return <GitHubIcon className={className} />;
    default:
      return <PluginPlugIcon className={className} />;
  }
};
