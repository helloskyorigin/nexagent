'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../../lib/firebase';
import {
  getOrCreateUserProfile,
  updateUserProfile as firestoreUpdateUserProfile,
  UserProfile,
} from '../../services/firestore/userProfile';
import { AuthContextType, AuthUser, AuthView } from './types';
import { Language, translations } from './translations';
import {
  AuthErrorInfo,
  getFriendlyAuthErrorMessage,
  validateEmailInput,
  validateNameInput,
  validatePasswordInput,
  evaluatePasswordStrength,
} from './authErrors';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSession = localStorage.getItem('nexorbit_auth_session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.language) {
            return parsed.language;
          }
        }
        const savedLang = localStorage.getItem('nexorbit_lang') as Language;
        if (savedLang) {
          return savedLang;
        }
      } catch (e) {}
    }
    return 'en';
  });

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const isAuthenticatedRef = useRef<boolean>(false);

  const setIsAuthenticated = useCallback((val: boolean) => {
    isAuthenticatedRef.current = val;
    setIsAuthenticatedState(val);
  }, []);

  const [authInitializing, setAuthInitializing] = useState<boolean>(true);
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [loading, setLoading] = useState<boolean>(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const [authErrorInfo, setAuthErrorInfo] = useState<AuthErrorInfo | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const isInitialMountRef = useRef<boolean>(true);

  const clearError = useCallback(() => {
    setAuthErrorInfo(null);
  }, []);

  const setAuthError = useCallback((err: AuthErrorInfo | string | null) => {
    if (!err) {
      setAuthErrorInfo(null);
      return;
    }
    if (typeof err === 'string') {
      setAuthErrorInfo({
        code: 'custom',
        message: err,
        targetField: 'general',
      });
    } else {
      setAuthErrorInfo(err);
    }
  }, []);

  // Backwards-compatible string error getter
  const error = authErrorInfo ? authErrorInfo.message : null;

  // Translation helper function
  const t = useCallback(
    (key: string): string => {
      return (
        translations[language]?.[key] ||
        translations['en']?.[key] ||
        key
      );
    },
    [language]
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexorbit_lang', lang);
      }
    } catch (e) {}
  }, []);

  const isAuthProcessingRef = useRef<boolean>(false);

  // Helper to load or create user profile in Firestore
  const loadOrCreateUserProfile = async (firebaseUser: any) => {
    return await getOrCreateUserProfile(firebaseUser);
  };

  // Check for redirect result on mount
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log('[Auth Lifecycle] getRedirectResult returned user:', result.user.uid, result.user.email);
        }
      })
      .catch((err) => {
        if (err.code !== 'auth/null-user') {
          console.warn('[Auth Lifecycle] getRedirectResult warning:', err?.code, err?.message);
        }
      });
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth Lifecycle] onAuthStateChanged event fired. User:', firebaseUser ? firebaseUser.uid : 'null');
      if (firebaseUser) {
        if (!isAuthenticatedRef.current) {
          setAuthView('authenticating');
        }

        try {
          console.log('[Auth Lifecycle] Resolving profile for UID:', firebaseUser.uid, 'Email:', firebaseUser.email);
          const profile = await loadOrCreateUserProfile(firebaseUser);
          
          const provider = firebaseUser.providerData[0]?.providerId || profile.provider || 'password';
          const displayName =
            profile.displayName ||
            firebaseUser.displayName ||
            (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User');
          const userLang = profile.language || 'en';

          console.log('[Auth Lifecycle] Profile resolved automatically. displayName:', displayName);

          const updatedUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || profile.email || '',
            displayName: displayName,
            photoURL: firebaseUser.photoURL || profile.photoURL || undefined,
            plan: 'Free Plan',
            country: profile.country || '',
            language: userLang,
            timezone: profile.timezone || 'Asia/Kolkata',
            workStyle: profile.workStyle || 'General Productivity',
            onboardingCompleted: true,
            isNewUser: false,
            provider: provider,
            getIdToken: () => firebaseUser.getIdToken(),
          };

          setUser(updatedUser);
          setLanguageState((prev) => profile.language || prev || 'en');

          setIsAuthenticated(true);
          setAuthView('success');
          console.log('[Auth Lifecycle] Routing authenticated user automatically to Home (success)');
        } catch (error: any) {
          console.error("[Auth Lifecycle] Exception resolving user profile:", error);
          setAuthErrorInfo({
            code: 'workspace-setup-error',
            title: "Couldn't prepare your workspace",
            message: 'Something went wrong while setting up your account. Please try again.',
            targetField: 'general',
          });
          setIsAuthenticated(false);
          setAuthView('error');
        }
      } else {
        // No user logged in
        console.log('[Auth Lifecycle] No authenticated user session.');
        setUser(null);
        setIsAuthenticated(false);
        setAuthView('welcome');
      }
      setAuthInitializing(false);
      isInitialMountRef.current = false;
    });

    return () => unsubscribe();
  }, [setIsAuthenticated]);

  // Handle OAuth provider with fallback
  const handleOAuthSignIn = async (providerName: 'google' | 'github', providerObj: any) => {
    if (isAuthProcessingRef.current) {
      console.log(`[Auth Lifecycle] OAuth sign-in already in progress, ignoring duplicate trigger.`);
      return;
    }
    isAuthProcessingRef.current = true;
    setLoading(true);
    setOauthLoading(providerName);
    clearError();

    try {
      console.log(`[Auth Lifecycle] Initiating ${providerName} signInWithPopup...`);
      await signInWithPopup(auth, providerObj);
      console.log(`[Auth Lifecycle] ${providerName} signInWithPopup succeeded.`);
      setAuthView('authenticating');
    } catch (err: any) {
      console.warn(`[Auth Lifecycle] ${providerName} Sign-In error:`, err?.code, err?.message);
      if (err?.code === 'auth/popup-blocked') {
        setAuthErrorInfo({
          code: err.code,
          message: "Your browser blocked the popup. Continuing with secure redirect sign-in...",
          targetField: 'general',
        });
        try {
          console.log(`[Auth Lifecycle] Falling back to signInWithRedirect for ${providerName}...`);
          await signInWithRedirect(auth, providerObj);
        } catch (redirectErr) {
          console.error(`[Auth Lifecycle] ${providerName} redirect error:`, redirectErr);
          setAuthErrorInfo(getFriendlyAuthErrorMessage(redirectErr));
        }
      } else if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        console.log(`[Auth Lifecycle] User closed the auth popup window.`);
      } else {
        setAuthErrorInfo(getFriendlyAuthErrorMessage(err));
      }
    } finally {
      setLoading(false);
      setOauthLoading(null);
      isAuthProcessingRef.current = false;
    }
  };

  // REAL GOOGLE AUTHENTICATION
  const signInWithGoogle = async () => {
    await handleOAuthSignIn('google', googleProvider);
  };

  // REAL GITHUB AUTHENTICATION
  const signInWithGitHub = async () => {
    await handleOAuthSignIn('github', githubProvider);
  };

  // EMAIL STEP 1: VALIDATE EMAIL PRE-CHECK
  const signInWithEmail = async (rawEmail: string) => {
    const emailValidation = validateEmailInput(rawEmail);
    if (!emailValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-email',
        message: emailValidation.error || 'Enter a valid email address.',
        targetField: 'email',
      });
      return;
    }

    clearError();
    setPendingEmail(emailValidation.cleanEmail);
    setAuthView('password');
  };

  // SUBMIT PASSWORD (EMAIL SIGN IN)
  const submitPassword = async (password: string) => {
    const passwordValidation = validatePasswordInput(password);
    if (!passwordValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/empty-password',
        message: passwordValidation.error || 'Enter your password.',
        targetField: 'password',
      });
      return;
    }

    setLoading(true);
    clearError();

    try {
      await signInWithEmailAndPassword(auth, pendingEmail, password);
      // onAuthStateChanged will handle routing to success or profile-setup
    } catch (err: unknown) {
      console.warn('Email Sign-In error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  // SIGN UP WITH EMAIL
  const signUpWithEmail = async (rawEmail: string, password: string, fullName?: string) => {
    // 1. Full name validation
    if (fullName !== undefined) {
      const nameValidation = validateNameInput(fullName);
      if (!nameValidation.isValid) {
        setAuthErrorInfo({
          code: 'validation/invalid-name',
          message: nameValidation.error || 'Enter your name.',
          targetField: 'name',
        });
        return;
      }
    }

    // 2. Email validation
    const emailValidation = validateEmailInput(rawEmail);
    if (!emailValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-email',
        message: emailValidation.error || 'Enter a valid email address.',
        targetField: 'email',
      });
      return;
    }

    // 3. Password validation
    const passwordEval = evaluatePasswordStrength(password);
    if (!passwordEval.isValid) {
      setAuthErrorInfo({
        code: 'validation/weak-password',
        message: 'Password must be at least 8 characters.',
        targetField: 'password',
      });
      return;
    }

    setLoading(true);
    clearError();
    setPendingEmail(emailValidation.cleanEmail);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        emailValidation.cleanEmail,
        password
      );

      const createdUser = credential.user;

      if (fullName && fullName.trim()) {
        const cleanName = fullName.trim();
        try {
          await updateProfile(createdUser, {
            displayName: cleanName,
          });
        } catch (e) {}
      }

      setAuthView('authenticating');
    } catch (err: unknown) {
      console.warn('Email Sign-Up error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
      setAuthView('create-account');
    } finally {
      setLoading(false);
    }
  };

  // PASSWORD RESET
  const sendPasswordReset = async (rawEmail: string) => {
    const emailValidation = validateEmailInput(rawEmail);
    if (!emailValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-email',
        message: emailValidation.error || 'Enter a valid email address.',
        targetField: 'email',
      });
      return;
    }

    setLoading(true);
    clearError();

    try {
      await sendPasswordResetEmail(auth, emailValidation.cleanEmail);
    } catch (err: unknown) {
      console.warn('Password Reset error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  // COMPLETE PROFILE SETUP & FIRST-TIME ONBOARDING
  const completeProfileSetup = async (profileData: {
    displayName: string;
    country: string;
    language: Language;
    timezone?: string;
    workStyle?: string;
  }) => {
    const nameValidation = validateNameInput(profileData.displayName);
    if (!nameValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-name',
        message: nameValidation.error || 'Enter your name.',
        targetField: 'name',
      });
      return;
    }

    setLoading(true);
    clearError();

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No authenticated user session found.');
      }

      // Update Firebase auth profile
      await updateProfile(firebaseUser, {
        displayName: nameValidation.cleanName,
      });

      const fullProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: nameValidation.cleanName,
        country: profileData.country || 'India 🇮🇳',
        language: profileData.language || 'en',
        timezone: profileData.timezone || 'Asia/Kolkata',
        workStyle: profileData.workStyle || 'General Productivity',
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage cache
      localStorage.setItem(`nexorbit_profile_${firebaseUser.uid}`, JSON.stringify(fullProfile));
      localStorage.setItem('nexorbit_lang', profileData.language);
      try {
        localStorage.removeItem('nexorbit_temp_fullname');
      } catch (e) {}

      // Save to Firestore database via service layer - MUST succeed
      await firestoreUpdateUserProfile(firebaseUser.uid, {
        displayName: nameValidation.cleanName,
        country: profileData.country || 'India 🇮🇳',
        language: profileData.language || 'en',
        onboardingCompleted: true,
        timezone: profileData.timezone || 'Asia/Kolkata',
        workStyle: profileData.workStyle || 'General Productivity',
      });

      // Update local state
      const updatedUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: nameValidation.cleanName,
        photoURL: firebaseUser.photoURL || undefined,
        plan: 'Free Plan',
        country: fullProfile.country,
        language: fullProfile.language,
        timezone: fullProfile.timezone,
        workStyle: fullProfile.workStyle,
        onboardingCompleted: true,
        isNewUser: false,
        provider: firebaseUser.providerData[0]?.providerId || 'password',
        getIdToken: () => firebaseUser.getIdToken(),
      };

      setUser(updatedUser);
      setLanguageState(profileData.language);

      setAuthView('success');
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.warn('Profile Setup caught error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
      setAuthView('profile-setup');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE USER PROFILE IN FIRESTORE
  const updateUserProfile = async (newData: Partial<AuthUser>) => {
    setLoading(true);
    clearError();
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No authenticated user session found.');
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      
      // Filter out any fields that are undefined or shouldn't go to database directly
      const cleanData: Record<string, any> = {};
      if (newData.displayName !== undefined) cleanData.displayName = newData.displayName;
      if (newData.country !== undefined) cleanData.country = newData.country;
      if (newData.language !== undefined) cleanData.language = newData.language;
      if (newData.timezone !== undefined) cleanData.timezone = newData.timezone;
      if (newData.workStyle !== undefined) cleanData.workStyle = newData.workStyle;
      if (newData.photoURL !== undefined) cleanData.photoURL = newData.photoURL;
      
      // Write to firestore via service
      await firestoreUpdateUserProfile(firebaseUser.uid, cleanData);

      // Save to localStorage cache
      const stored = localStorage.getItem(`nexorbit_profile_${firebaseUser.uid}`);
      let currentCache = {};
      if (stored) {
        try {
          currentCache = JSON.parse(stored);
        } catch (e) {}
      }
      localStorage.setItem(
        `nexorbit_profile_${firebaseUser.uid}`,
        JSON.stringify({ ...currentCache, ...cleanData })
      );

      if (newData.language) {
        localStorage.setItem('nexorbit_lang', newData.language);
        setLanguageState(newData.language);
      }

      // Update local state
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...newData,
        };
      });
    } catch (err: unknown) {
      console.warn('Update Profile Setup caught error:', err);
      // Construct JSON message for firestore error handling compliance
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
        },
        operationType: 'update',
        path: `users/${auth.currentUser?.uid}`,
      };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
      setAuthError(err instanceof Error ? err.message : String(err));
      throw new Error(JSON.stringify(errInfo));
    } finally {
      setLoading(false);
    }
  };

  // REAL SIGN OUT
  const signOut = async () => {
    setLoading(true);
    clearError();
    try {
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      console.warn('Sign-Out error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setAuthView('welcome');
      setPendingEmail('');
      setLoading(false);
      if (typeof window !== 'undefined') {
        window.location.hash = '';
      }
    }
  };

  // STUB FOR DEMO AUTH TOGGLE
  const toggleDemoAuth = () => {
    console.warn('Real Firebase Authentication is active.');
  };

  const getIdToken = useCallback(async (): Promise<string> => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return '';
  }, []);

  // Derived / exposed values
  const uid = user?.uid || null;
  const displayName = user?.displayName || null;
  const email = user?.email || null;
  const photoURL = user?.photoURL || null;
  const provider = user?.provider || null;
  const authLoading = loading || authInitializing;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        uid,
        displayName,
        email,
        photoURL,
        provider,
        isAuthenticated,
        authInitializing,
        authLoading,
        authView,
        loading,
        oauthLoading,
        error,
        authErrorInfo,
        pendingEmail,
        language,
        setLanguage,
        t,
        setPendingEmail,
        setAuthView,
        setAuthError,
        clearError,
        getIdToken,
        signInWithGoogle,
        signInWithGitHub,
        signInWithEmail,
        submitPassword,
        signUpWithEmail,
        sendPasswordReset,
        completeProfileSetup,
        updateUserProfile,
        signOut,
        toggleDemoAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

