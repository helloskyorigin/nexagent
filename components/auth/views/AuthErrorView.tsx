'use client';

import React from 'react';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AuthErrorView: React.FC = () => {
  const { authErrorInfo, error, setAuthView, clearError, signOut } = useAuth();

  const title = authErrorInfo?.title || "Couldn't prepare your workspace";
  const description =
    authErrorInfo?.message ||
    error ||
    'Something went wrong while setting up your account. Please try again.';

  const handleTryAgain = () => {
    clearError();
    setAuthView('authenticating');
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleBackToSignIn = async () => {
    clearError();
    try {
      await signOut();
    } catch (e) {}
    setAuthView('welcome');
  };

  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600">
          <AlertCircle className="h-6 w-6 text-rose-600" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="text-xs text-slate-500 font-normal max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-2 space-y-2.5">
        <button
          onClick={handleTryAgain}
          type="button"
          className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-sm shadow-sm transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try again</span>
        </button>

        <button
          onClick={handleBackToSignIn}
          type="button"
          className="w-full h-10 px-4 rounded-xl bg-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </button>
      </div>
    </div>
  );
};
