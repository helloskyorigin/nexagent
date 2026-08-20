'use client';

export type ThemeOption = 'dark' | 'light' | 'auto';

export interface NexorbitSettings {
  theme: ThemeOption;
  showTimestamps: boolean;
  enterToSend: boolean;
  allowNotifications: boolean;
  taskAlerts: boolean;
  securityAlerts: boolean;
  soundEnabled: boolean;
  memoryEnabled: boolean;
}

const STORAGE_KEY = 'nexorbit_user_settings';

const DEFAULT_SETTINGS: NexorbitSettings = {
  theme: 'dark',
  showTimestamps: true,
  enterToSend: true,
  allowNotifications: true,
  taskAlerts: true,
  securityAlerts: true,
  soundEnabled: false,
  memoryEnabled: true,
};

type Listener = (settings: NexorbitSettings) => void;
const listeners = new Set<Listener>();

export function getStoredSettings(): NexorbitSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.warn('Failed to parse settings from localStorage:', e);
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(updates: Partial<NexorbitSettings>): NexorbitSettings {
  const current = getStoredSettings();
  const next = { ...current, ...updates };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  }

  listeners.forEach((listener) => {
    try {
      listener(next);
    } catch (e) {
      console.error('Error in settings listener:', e);
    }
  });

  return next;
}

export function subscribeToSettings(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
