/**
 * Nexorbit AUTHENTICATION ERROR MAPPING & SMART VALIDATION LAYER
 * 
 * Maps technical Firebase Auth error codes and exceptions into human-friendly,
 * safe, and actionable messages. Never exposes raw stack traces, error codes,
 * or backend implementation details to users.
 */

export interface AuthErrorInfo {
  code: string;
  title?: string;
  message: string;
  isExistingAccount?: boolean;
  targetField?: 'email' | 'password' | 'confirmPassword' | 'name' | 'general';
  actionType?: 'signin' | 'signup' | 'retry' | 'reset-password' | 'allow-popups';
}

/**
 * Extracts a normalized Firebase error code from any error object or string.
 */
export function extractErrorCode(error: unknown): string {
  if (!error) return 'unknown';

  if (typeof error === 'string') {
    const match = error.match(/auth\/[a-z0-9-]+/i);
    return match ? match[0].toLowerCase() : error;
  }

  if (typeof error === 'object') {
    const errObj = error as Record<string, any>;
    if (typeof errObj.code === 'string') {
      return errObj.code.toLowerCase();
    }
    if (typeof errObj.message === 'string') {
      const match = errObj.message.match(/auth\/[a-z0-9-]+/i);
      if (match) return match[0].toLowerCase();
    }
  }

  return 'unknown';
}

/**
 * Maps any error into a safe, human-friendly error info object.
 */
export function getFriendlyAuthErrorMessage(error: unknown): AuthErrorInfo {
  const code = extractErrorCode(error);

  switch (code) {
    // Account collisions & duplicate registration
    case 'auth/email-already-in-use':
      return {
        code,
        message: 'An account already exists with this email.',
        isExistingAccount: true,
        targetField: 'email',
        actionType: 'signin',
      };

    case 'auth/account-exists-with-different-credential':
      return {
        code,
        message: 'An account already exists with this email.',
        isExistingAccount: true,
        targetField: 'email',
        actionType: 'signin',
      };

    // User not found (when safely explicitly provided by Firebase)
    case 'auth/user-not-found':
      return {
        code,
        message: 'No account found with this email.',
        targetField: 'email',
        actionType: 'signup',
      };

    // Invalid credentials / login failures
    case 'auth/wrong-password':
      return {
        code,
        message: 'Incorrect password. Try again.',
        targetField: 'password',
        actionType: 'retry',
      };

    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return {
        code,
        message: 'Incorrect password. Try again.',
        targetField: 'password',
        actionType: 'retry',
      };

    // Email validation
    case 'auth/invalid-email':
      return {
        code,
        message: 'Enter a valid email address.',
        targetField: 'email',
        actionType: 'retry',
      };

    // Password strength
    case 'auth/weak-password':
      return {
        code,
        message: 'Password must be at least 8 characters.',
        targetField: 'password',
        actionType: 'retry',
      };

    // Rate limiting & abuse protection
    case 'auth/too-many-requests':
      return {
        code,
        title: 'Too many attempts',
        message: 'Too many attempts. Please wait a moment and try again.',
        targetField: 'general',
        actionType: 'retry',
      };

    // OAuth / Popup flows
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return {
        code,
        message: 'Sign-in was cancelled. You can try again.',
        targetField: 'general',
        actionType: 'retry',
      };

    case 'auth/popup-blocked':
      return {
        code,
        title: 'Pop-up blocked',
        message: 'Your browser blocked the sign-in window. Allow pop-ups and try again.',
        targetField: 'general',
        actionType: 'allow-popups',
      };

    // Connectivity & network
    case 'auth/unauthorized-domain':
      return {
        code,
        title: 'Unauthorized Domain',
        message: 'This domain is not authorized in Firebase Console. Please add this domain in Firebase Authentication > Settings > Authorized Domains.',
        targetField: 'general',
        actionType: 'retry',
      };

    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid-please-pass-a-valid-api-key':
      return {
        code,
        title: 'Invalid API Key',
        message: 'Firebase API key is missing or invalid. Please check your project settings.',
        targetField: 'general',
        actionType: 'retry',
      };

    case 'auth/network-request-failed':
      return {
        code,
        title: 'Connection error',
        message: "Couldn't connect. Check your internet connection and try again.",
        targetField: 'general',
        actionType: 'retry',
      };

    // Account status
    case 'auth/user-disabled':
      return {
        code,
        title: 'Account disabled',
        message: 'This account has been disabled. Please contact support.',
        targetField: 'general',
      };

    case 'auth/operation-not-allowed':
      return {
        code,
        message: 'This sign-in method is currently not enabled.',
        targetField: 'general',
      };

    case 'auth/requires-recent-login':
      return {
        code,
        message: 'Please sign in again to continue this operation.',
        targetField: 'general',
        actionType: 'signin',
      };

    default:
      return {
        code: 'unknown',
        message: "Couldn't connect. Check your internet connection and try again.",
        targetField: 'general',
        actionType: 'retry',
      };
  }
}

/**
 * Standard client-side email format and sanitation validator.
 */
export function validateEmailInput(input: string): {
  isValid: boolean;
  cleanEmail: string;
  error?: string;
} {
  const cleanEmail = (input || '').trim().toLowerCase();

  if (!cleanEmail) {
    return {
      isValid: false,
      cleanEmail: '',
      error: 'Enter your email address.',
    };
  }

  // Strict email regex rejecting missing domains, @ with no user or domain, etc.
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(cleanEmail)) {
    return {
      isValid: false,
      cleanEmail,
      error: 'Enter a valid email address.',
    };
  }

  return {
    isValid: true,
    cleanEmail,
  };
}

/**
 * Password input validator.
 */
export function validatePasswordInput(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Enter your password.',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters.',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Standard full name validator.
 */
export function validateNameInput(input: string): {
  isValid: boolean;
  cleanName: string;
  error?: string;
} {
  const cleanName = (input || '').trim();

  if (!cleanName) {
    return {
      isValid: false,
      cleanName: '',
      error: 'Enter your name.',
    };
  }

  if (cleanName.length < 2) {
    return {
      isValid: false,
      cleanName,
      error: 'Your name should be at least 2 characters.',
    };
  }

  if (cleanName.length > 60) {
    return {
      isValid: false,
      cleanName: cleanName.slice(0, 60),
      error: 'Name must be 60 characters or less.',
    };
  }

  return {
    isValid: true,
    cleanName,
  };
}

/**
 * Live password requirement tester.
 */
export function evaluatePasswordStrength(password: string): {
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  isValid: boolean;
} {
  const hasMinLength = (password || '').length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password || '');
  const hasNumber = /[0-9]/.test(password || '');

  return {
    hasMinLength,
    hasLetter,
    hasNumber,
    isValid: hasMinLength && hasLetter && hasNumber,
  };
}

