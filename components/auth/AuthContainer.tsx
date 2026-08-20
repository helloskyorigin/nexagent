'use client';

import React, { useState } from 'react';
import { Shield, Zap, Lock, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from './AuthContext';
import { WelcomeView } from './views/WelcomeView';
import { CreateAccountView } from './views/CreateAccountView';
import { PasswordInputView } from './views/PasswordInputView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ProfileSetupView } from './views/ProfileSetupView';
import { AuthenticatingView } from './views/AuthenticatingView';
import { AuthErrorView } from './views/AuthErrorView';
import { AuthSuccessView } from './views/AuthSuccessView';
import { NexorbitLogo } from './NexorbitLogo';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

export interface AuthContainerProps {
  className?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ className }) => {
  const { authView, language, setLanguage } = useAuth();
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const renderCurrentView = () => {
    switch (authView) {
      case 'welcome':
      case 'email-signin':
        return <WelcomeView />;
      case 'create-account':
        return <CreateAccountView />;
      case 'password':
        return <PasswordInputView />;
      case 'forgot-password':
        return <ForgotPasswordView />;
      case 'profile-setup':
      case 'authenticating':
        return <AuthenticatingView />;
      case 'error':
        return <AuthErrorView />;
      case 'success':
        return <AuthSuccessView />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen w-full orbital-canvas flex flex-col justify-between items-center relative overflow-hidden antialiased selection:bg-indigo-100 selection:text-indigo-900',
        className
      )}
    >
      {/* ================= BACKGROUND PARTICLE & WAVE PATTERN (Matches Image) ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent blur-3xl opacity-80" />

        {/* Delicate Dot Matrix Wave SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dotPattern"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="#3B82F6" opacity="0.25" />
            </pattern>
            <linearGradient id="waveMask" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#dotPattern)" />

          {/* Flowing Curved Orbit Vectors */}
          <path
            d="M -100 200 Q 400 50, 900 300 T 1900 100"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="opacity-30"
          />
          <path
            d="M -50 400 Q 600 150, 1200 500 T 2000 200"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1"
            className="opacity-20"
          />
        </svg>
      </div>

      {/* ================= TOP RIGHT LANGUAGE SELECTOR (Matches Image) ================= */}
      <header className="w-full max-w-7xl px-6 py-5 flex items-center justify-end z-20 relative">
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-slate-200/80 hover:border-slate-300 text-xs font-medium text-slate-700 hover:text-slate-900 shadow-2xs transition-all cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === 'en' ? 'English' : 'हिन्दी'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-slate-200/90 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setLangMenuOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-1.5 text-xs text-left font-medium transition-colors cursor-pointer flex items-center justify-between',
                  language === 'en' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <span>English</span>
                {language === 'en' && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  setLangMenuOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-1.5 text-xs text-left font-medium transition-colors cursor-pointer flex items-center justify-between',
                  language === 'hi' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <span>हिन्दी</span>
                {language === 'hi' && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================= MAIN CENTERED CARD (Desktop / Tablet / Mobile) ================= */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 py-6 z-10 my-auto">
        <div className="w-full max-w-[440px] orbital-glass-elevated rounded-3xl p-7 sm:p-10 transition-all duration-200 relative">
          {renderCurrentView()}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-4 text-center z-10 text-[11px] text-slate-400 font-normal">
        &copy; {new Date().getFullYear()} Nexorbit AI Workspace.
      </footer>

      {/* Terms of Service & Privacy Policy Modals */}
      <Modal
        isOpen={legalModal !== null}
        onClose={() => setLegalModal(null)}
        title={legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        description={`Nexorbit ${legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'} Agreement`}
      >
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-80 overflow-y-auto pr-1">
          {legalModal === 'terms' ? (
            <>
              <p>
                Welcome to Nexorbit. By accessing or using our personal AI workspace platform, you agree to be bound by these Terms of Service.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">1. Your AI Workspace</h4>
              <p>
                Nexorbit provides a privacy-first AI workspace engine. You retain full ownership and intellectual property rights to all prompts, data, and workspace contents.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">2. Acceptable Use</h4>
              <p>
                You agree not to misuse the Nexorbit services or assist anyone else in doing so, including attempting unauthorized access to any system.
              </p>
            </>
          ) : (
            <>
              <p>
                At Nexorbit, your privacy and data sovereignty are paramount. We design all AI workspaces with strict boundary isolation.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">1. Data Ownership</h4>
              <p>
                Your personal notes, emails, documents, and context memory vectors are strictly isolated to your authenticated account and are never used to train public models.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">2. Encryption</h4>
              <p>
                All workspace data is encrypted at rest and in transit using modern cryptographic standards.
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
