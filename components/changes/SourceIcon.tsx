'use client';

import React from 'react';

export interface SourceIconProps {
  type: string;
  className?: string;
}

export const SourceIcon: React.FC<SourceIconProps> = ({ type, className = 'h-4 w-4' }) => {
  const normalized = type.toLowerCase().trim();

  if (normalized.includes('gmail') || normalized === 'mail') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 18V6.825C1.5 5.5875 2.5125 4.5 3.825 4.5H5.25L12 10.5L18.75 4.5H20.175C21.4875 4.5 22.5 5.5875 22.5 6.825V18C22.5 19.2375 21.4875 20.25 20.175 20.25H18V10.5L12 15.375L6 10.5V20.25H3.825C2.5125 20.25 1.5 19.2375 1.5 18Z" fill="#EA4335" />
        <path d="M18 20.25H20.175C21.4875 20.25 22.5 19.2375 22.5 18V6.825C22.5 5.5875 21.4875 4.5 20.175 4.5H18.75L18 5.1V10.5V20.25Z" fill="#4285F4" />
        <path d="M1.5 18C1.5 19.2375 2.5125 20.25 3.825 20.25H6V10.5V5.1L5.25 4.5H3.825C2.5125 4.5 1.5 5.5875 1.5 6.825V18Z" fill="#34A853" />
        <path d="M6 10.5L12 15.375L18 10.5V5.1L12 10.5L6 5.1V10.5Z" fill="#FBBC04" />
        <path d="M18 5.1L18.75 4.5H20.175C21.4875 4.5 22.5 5.5875 22.5 6.825V18C22.5 19.2375 21.4875 20.25 20.175 20.25H18V10.5L12 15.375L6 10.5V20.25H3.825C2.5125 20.25 1.5 19.2375 1.5 18V6.825C1.5 5.5875 2.5125 4.5 3.825 4.5H5.25L6 5.1L12 10.5L18 5.1Z" fill="#C5221F" opacity="0.1" />
      </svg>
    );
  }

  if (normalized.includes('calendar')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3.5" width="20" height="17" rx="3" fill="#4285F4" />
        <path d="M2 8H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 2V5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 2V5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <text x="12" y="17.5" fill="white" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          31
        </text>
      </svg>
    );
  }

  if (normalized.includes('drive')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.2 3.5H15.8L22 14.3H14.4L8.2 3.5Z" fill="#FFC107" />
        <path d="M14.4 14.3H22L18.2 20.8H10.6L14.4 14.3Z" fill="#129653" />
        <path d="M10.6 20.8L2 20.8L5.8 14.3L8.2 3.5L10.6 20.8Z" fill="#0066DA" />
        <path d="M8.2 3.5L2 14.3L5.8 20.8L14.4 14.3L8.2 3.5Z" fill="#2684FC" />
      </svg>
    );
  }

  if (normalized.includes('meet') || normalized.includes('video')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 11V5L7 9.5L12 11Z" fill="#00832D" />
        <path d="M12 11L17 6.5V17.5L12 13V11Z" fill="#0066DA" />
        <path d="M7 14.5L12 13V19L7 14.5Z" fill="#E51C23" />
        <path d="M7 9.5V14.5L2 11V8L7 9.5Z" fill="#FFC107" />
      </svg>
    );
  }

  if (normalized.includes('notion')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 3.5C3.95 3.5 3.5 3.95 3.5 4.5V19.5C3.5 20.05 3.95 20.5 4.5 20.5H19.5C20.05 20.5 20.5 20.05 20.5 19.5V4.5C20.5 3.95 20.05 3.5 19.5 3.5H4.5ZM7.5 7H9.8L14.5 14.2V7H16.5V17H14.2L9.5 9.8V17H7.5V7Z" fill="#000000" />
      </svg>
    );
  }

  if (normalized.includes('github')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
};

