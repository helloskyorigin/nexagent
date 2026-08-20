'use client';

import React, { useState, useRef } from 'react';
import { ArrowLeft, Mail, Send, KeyRound, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import { validateEmailInput } from '../authErrors';

export const ForgotPasswordView: React.FC = () => {
  const {
    pendingEmail,
    sendPasswordReset,
    setAuthView,
    loading,
    authErrorInfo,
    clearError,
    setAuthError,
  } = useAuth();

  const [email, setEmail] = useState(pendingEmail || '');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Determine if email has active error
  const isEmailError = localError !== null || authErrorInfo?.targetField === 'email';
  const emailErrorMessage = localError || (authErrorInfo?.targetField === 'email' ? authErrorInfo.message : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || email.trim().length === 0) {
      setLocalError('Enter your email address.');
      emailInputRef.current?.focus();
      return;
    }

    const emailValidation = validateEmailInput(email);
    if (!emailValidation.isValid) {
      setLocalError(emailValidation.error || 'Enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    setLocalError(null);
    clearError();
    try {
      await sendPasswordReset(emailValidation.cleanEmail);
      setSentToEmail(emailValidation.cleanEmail);
      setIsSent(true);
    } catch (err) {
      // Handled in AuthContext
    }
  };

  const handleOpenEmailApp = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'mailto:';
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Top Back Navigation */}
      <div>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            clearError();
            setAuthView('email-signin');
          }}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to sign in</span>
        </button>
      </div>

      {isSent ? (
        /* Password Reset Link Sent State */
        <div className="space-y-6 text-center py-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Send className="h-6 w-6 stroke-[2]" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              Check your email
            </h1>
            <p className="text-[15px] text-slate-500 font-normal leading-relaxed max-w-sm mx-auto">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-semibold text-slate-800">{sentToEmail}</span>. If you don&apos;t see it, check your spam or junk folder.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleOpenEmailApp}
              className="w-full h-[52px] px-5 rounded-[16px] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Open email app</span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthView('email-signin');
              }}
              className="w-full h-[52px] text-[15px] font-medium text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              Back to sign in
            </button>
          </div>
        </div>
      ) : (
        /* Forgot Password Input State */
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-2 mt-4">
            <div className="h-14 w-14 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <KeyRound className="h-6 w-6 stroke-[2]" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              Reset your password
            </h1>
            <p className="text-[15px] text-slate-500 font-normal leading-relaxed max-w-sm mx-auto">
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          {authErrorInfo && authErrorInfo.targetField !== 'email' && (
            <AuthErrorBanner
              error={authErrorInfo}
              onDismiss={clearError}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-[13px] font-medium text-slate-700 block">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  ref={emailInputRef}
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck="false"
                  value={email}
                  disabled={loading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (localError) setLocalError(null);
                    if (authErrorInfo) clearError();
                  }}
                  placeholder="name@company.com"
                  required
                  autoFocus
                  className={`w-full h-[52px] pl-[42px] pr-4 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 rounded-[16px] border transition-all duration-200 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                    isEmailError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-[3px] focus:ring-rose-500/15'
                      : 'border-slate-200 focus:border-slate-950 focus:ring-[3px] focus:ring-slate-950/10'
                  }`}
                />
              </div>

              {isEmailError && emailErrorMessage && (
                <p className="text-[13px] text-rose-600 font-medium pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {emailErrorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] px-5 rounded-[16px] bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
              ) : (
                <span>Send reset link</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                clearError();
                setAuthView('email-signin');
              }}
              className="text-[13px] text-slate-500 hover:text-slate-950 font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Never mind, take me back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
