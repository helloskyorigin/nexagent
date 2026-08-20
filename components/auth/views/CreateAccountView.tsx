'use client';

import React, { useState, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, User, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import {
  validateEmailInput,
  validateNameInput,
  evaluatePasswordStrength,
} from '../authErrors';

export const CreateAccountView: React.FC = () => {
  const {
    signInWithGoogle,
    signInWithGitHub,
    signUpWithEmail,
    setAuthView,
    setPendingEmail,
    loading,
    oauthLoading,
    authErrorInfo,
    clearError,
    setAuthError,
    pendingEmail,
  } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(pendingEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasInteractedWithConfirm, setHasInteractedWithConfirm] = useState(false);

  // Local per-field errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  // Live password strength
  const passwordStrength = evaluatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const showPasswordMismatch =
    (hasInteractedWithConfirm && confirmPassword.length > 0 && password !== confirmPassword) ||
    confirmError !== null;

  // Active error calculations
  const isNameActiveError = nameError !== null || authErrorInfo?.targetField === 'name';
  const nameActiveErrorMessage = nameError || (authErrorInfo?.targetField === 'name' ? authErrorInfo.message : null);

  const isEmailActiveError = emailError !== null || authErrorInfo?.targetField === 'email';
  const emailActiveErrorMessage = emailError || (authErrorInfo?.targetField === 'email' ? authErrorInfo.message : null);

  const isPasswordActiveError = passwordError !== null || authErrorInfo?.targetField === 'password';
  const passwordActiveErrorMessage = passwordError || (authErrorInfo?.targetField === 'password' ? authErrorInfo.message : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || oauthLoading) return;

    // Reset local errors
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);

    // 1. Validate full name
    const nameValidation = validateNameInput(fullName);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || 'Enter your name.');
      nameInputRef.current?.focus();
      return;
    }

    // 2. Validate email
    const emailValidation = validateEmailInput(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || 'Enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    // 3. Validate password strength
    if (!passwordStrength.isValid) {
      setPasswordError('Password must be at least 8 characters.');
      passwordInputRef.current?.focus();
      return;
    }

    // 4. Validate confirm password
    if (password !== confirmPassword) {
      setHasInteractedWithConfirm(true);
      setConfirmError("Passwords don't match.");
      confirmPasswordInputRef.current?.focus();
      return;
    }

    clearError();
    signUpWithEmail(emailValidation.cleanEmail, password, nameValidation.cleanName);
  };

  const handleActionClick = (actionType?: string) => {
    if (actionType === 'signin') {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail) {
        setPendingEmail(cleanEmail);
      }
      clearError();
      setAuthView('password');
    } else {
      clearError();
      emailInputRef.current?.focus();
      emailInputRef.current?.select();
    }
  };

  const isAnyLoading = loading || oauthLoading !== null;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-950">
          Create an account
        </h1>
        <p className="text-[15px] text-slate-500 font-normal leading-relaxed">
          Start building your AI workspace.
        </p>
      </div>

      {/* Tabs (Sign in / Sign up) */}
      <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
        <button 
          type="button"
          onClick={() => {
            clearError();
            setAuthView('welcome');
          }}
          className="py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer text-center"
        >
          Sign in
        </button>
        <button 
          type="button"
          className="py-2 text-xs font-bold text-slate-950 bg-white rounded-lg shadow-xs transition-all cursor-pointer text-center"
        >
          Sign up
        </button>
      </div>

      {/* Structured General Error Banner (only for non-field specific errors) */}
      {authErrorInfo &&
        authErrorInfo.targetField !== 'name' &&
        authErrorInfo.targetField !== 'email' &&
        authErrorInfo.targetField !== 'password' && (
          <AuthErrorBanner
            error={authErrorInfo}
            onDismiss={clearError}
            onAction={handleActionClick}
          />
        )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="text-[13px] font-medium text-slate-700 block">
            Full name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <input
              ref={nameInputRef}
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              value={fullName}
              disabled={isAnyLoading}
              onChange={(e) => {
                setFullName(e.target.value);
                if (nameError) setNameError(null);
                if (authErrorInfo) clearError();
              }}
              placeholder="Your name"
              required
              autoFocus
              className={`w-full h-[52px] pl-[42px] pr-4 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-200 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                isNameActiveError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {isNameActiveError && nameActiveErrorMessage && (
            <p className="text-[13px] text-rose-600 font-medium pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {nameActiveErrorMessage}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-[13px] font-medium text-slate-700 block">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              ref={emailInputRef}
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              value={email}
              disabled={isAnyLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
                if (authErrorInfo) clearError();
              }}
              placeholder="name@company.com"
              required
              className={`w-full h-[52px] pl-[42px] pr-4 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-200 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                isEmailActiveError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {isEmailActiveError && emailActiveErrorMessage && (
            <div className="flex items-center justify-between pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <p className="text-[13px] text-rose-600 font-medium">
                {emailActiveErrorMessage}
              </p>
              {authErrorInfo?.actionType === 'signin' && (
                <button
                  type="button"
                  onClick={() => handleActionClick('signin')}
                  className="text-[13px] text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
                >
                  Sign in instead
                </button>
              )}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="text-[13px] font-medium text-slate-700 block">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              ref={passwordInputRef}
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              disabled={isAnyLoading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
                if (authErrorInfo) clearError();
              }}
              placeholder="Create a password"
              required
              className={`w-full h-[52px] pl-[42px] pr-12 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-200 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                isPasswordActiveError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {isPasswordActiveError && passwordActiveErrorMessage && (
            <p className="text-[13px] text-rose-600 font-medium pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {passwordActiveErrorMessage}
            </p>
          )}

          {/* Live Password Requirements Checklist */}
          <div className="pt-2 grid grid-cols-3 gap-1">
            <div className="flex items-center gap-1.5 text-xs font-normal transition-colors">
              <div
                className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                  passwordStrength.hasMinLength
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span
                className={
                  passwordStrength.hasMinLength ? 'text-slate-700 font-medium' : 'text-slate-400'
                }
              >
                8+ chars
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-normal transition-colors">
              <div
                className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                  passwordStrength.hasLetter
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span
                className={
                  passwordStrength.hasLetter ? 'text-slate-700 font-medium' : 'text-slate-400'
                }
              >
                Has letter
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-normal transition-colors">
              <div
                className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                  passwordStrength.hasNumber
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span
                className={
                  passwordStrength.hasNumber ? 'text-slate-700 font-medium' : 'text-slate-400'
                }
              >
                Has number
              </span>
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-confirm-password" className="text-[13px] font-medium text-slate-700 block">
            Confirm password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              ref={confirmPasswordInputRef}
              id="signup-confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              disabled={isAnyLoading}
              onBlur={() => setHasInteractedWithConfirm(true)}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setHasInteractedWithConfirm(true);
                if (confirmError) setConfirmError(null);
                if (authErrorInfo) clearError();
              }}
              placeholder="Re-enter your password"
              required
              className={`w-full h-[52px] pl-[42px] pr-12 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 rounded-[16px] border transition-all duration-200 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                showPasswordMismatch
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-[3px] focus:ring-rose-500/15'
                  : passwordsMatch
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-[3px] focus:ring-emerald-500/15'
                  : 'border-slate-200 focus:border-slate-950 focus:ring-[3px] focus:ring-slate-950/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {showPasswordMismatch && (
            <p className="text-[13px] text-rose-600 font-medium pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              Passwords don&apos;t match.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnyLoading}
          className="w-full h-[52px] px-5 rounded-[16px] bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group mt-4 mb-2"
        >
          {loading && !oauthLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          ) : (
            <span>Create account</span>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <span className="relative bg-white px-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
          OR
        </span>
      </div>

      {/* Social options */}
      <div className="space-y-3.5">
        <button
          onClick={signInWithGoogle}
          disabled={isAnyLoading}
          type="button"
          className="w-full h-[52px] px-5 rounded-[16px] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            {oauthLoading === 'google' ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            ) : (
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign up with Google</span>
          </div>
          <svg className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <button
          onClick={signInWithGitHub}
          disabled={isAnyLoading}
          type="button"
          className="w-full h-[52px] px-5 rounded-[16px] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            {oauthLoading === 'github' ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
            ) : (
              <svg className="h-5 w-5 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            )}
            <span>Sign up with GitHub</span>
          </div>
          <svg className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
