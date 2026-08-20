import { Language, translations } from './translations';
import { AuthErrorInfo } from './authErrors';

export type AuthView =
  | 'welcome'
  | 'create-account'
  | 'email-signin'
  | 'password'
  | 'forgot-password'
  | 'authenticating'
  | 'error'
  | 'profile-setup'
  | 'success';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: string;
  role?: string;
  country?: string;
  language?: Language;
  timezone?: string;
  workStyle?: string;
  onboardingCompleted?: boolean;
  isNewUser?: boolean;
  provider?: string;
  getIdToken?: () => Promise<string>;
}

export interface AuthContextType {
  user: AuthUser | null;
  currentUser: AuthUser | null;
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string | null;
  isAuthenticated: boolean;
  authInitializing: boolean;
  authLoading: boolean;
  authView: AuthView;
  loading: boolean;
  oauthLoading: 'google' | 'github' | null;
  error: string | null;
  authErrorInfo: AuthErrorInfo | null;
  pendingEmail: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  setPendingEmail: (email: string) => void;
  setAuthView: (view: AuthView) => void;
  setAuthError: (err: AuthErrorInfo | string | null) => void;
  clearError: () => void;
  getIdToken: () => Promise<string>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  submitPassword: (password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  completeProfileSetup: (profileData: {
    displayName: string;
    country: string;
    language: Language;
    timezone?: string;
    workStyle?: string;
  }) => Promise<void>;
  updateUserProfile: (newData: Partial<AuthUser>) => Promise<void>;
  signOut: () => void;
  toggleDemoAuth: () => void;
}

