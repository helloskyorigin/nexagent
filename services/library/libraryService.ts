'use client';

export type LibraryItemType = 'document' | 'bookmark' | 'image' | 'code';

export interface LibraryItem {
  id: string;
  title: string;
  type: LibraryItemType;
  fileType?: string; // e.g. 'PDF', 'PNG', 'DOCX', 'TXT', 'Python', 'TypeScript'
  fileSize?: number; // size in bytes
  url?: string; // for bookmarks and links
  content?: string; // for notes, markdown, and code snippets
  language?: string; // for code snippets
  dataUrl?: string; // base64 / blob URL for previewing uploaded images & files
  fileName?: string; // original uploaded file name
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  source?: string;
}

const STORAGE_KEY = 'nexorbit_library_items_v1';
const LISTENERS: Array<(items: LibraryItem[]) => void> = [];

function notifyListeners(items: LibraryItem[]) {
  LISTENERS.forEach((listener) => {
    try {
      listener(items);
    } catch (e) {
      console.error('Error in library listener:', e);
    }
  });
}

/**
 * Loads real stored library items. Returns empty array if none exist.
 * Absolutely NO fake or demo data.
 */
export function getStoredLibraryItems(): LibraryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load library items:', err);
  }
  return [];
}

/**
 * Saves library items to localStorage and notifies reactive listeners.
 */
export function saveStoredLibraryItems(items: LibraryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    notifyListeners(items);
  } catch (err) {
    console.error('Failed to save library items:', err);
  }
}

/**
 * Subscribes to real-time changes in Library data.
 */
export function subscribeToLibrary(callback: (items: LibraryItem[]) => void): () => void {
  LISTENERS.push(callback);
  // Immediately call with current state
  callback(getStoredLibraryItems());

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredLibraryItems());
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    const index = LISTENERS.indexOf(callback);
    if (index > -1) {
      LISTENERS.splice(index, 1);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
}

/**
 * Helper to determine item type from MIME type and file extension.
 */
export function detectFileTypeAndCategory(file: File): {
  category: LibraryItemType;
  displayType: string;
} {
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  // Images
  if (mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/.test(name)) {
    const ext = name.split('.').pop()?.toUpperCase() || 'IMAGE';
    return { category: 'image', displayType: ext };
  }

  // Code files
  if (
    /\.(js|jsx|ts|tsx|py|rb|go|rs|cpp|c|h|java|php|html|css|scss|json|sql|sh|yml|yaml|xml|md|toml)$/.test(
      name
    )
  ) {
    const ext = name.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      ts: 'TypeScript',
      tsx: 'TypeScript (React)',
      js: 'JavaScript',
      jsx: 'JavaScript (React)',
      py: 'Python',
      rs: 'Rust',
      go: 'Go',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      sql: 'SQL',
      sh: 'Shell',
      md: 'Markdown',
    };
    return { category: 'code', displayType: langMap[ext || ''] || (ext ? ext.toUpperCase() : 'Code') };
  }

  // Documents
  let docType = 'Document';
  if (mime.includes('pdf') || name.endsWith('.pdf')) docType = 'PDF';
  else if (mime.includes('word') || name.endsWith('.docx') || name.endsWith('.doc')) docType = 'DOCX';
  else if (mime.includes('sheet') || name.endsWith('.xlsx') || name.endsWith('.csv')) docType = 'Spreadsheet';
  else if (mime.includes('presentation') || name.endsWith('.pptx')) docType = 'Presentation';
  else if (mime.includes('text') || name.endsWith('.txt')) docType = 'TXT';
  else {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext) docType = ext;
  }

  return { category: 'document', displayType: docType };
}

/**
 * Creates a library record from a real uploaded file.
 */
export async function createFileItem(file: File, customTitle?: string): Promise<LibraryItem> {
  const { category, displayType } = detectFileTypeAndCategory(file);
  const now = new Date().toISOString();

  // Read data url for images or small previewable files
  let dataUrl: string | undefined = undefined;
  let content: string | undefined = undefined;

  if (category === 'image' || file.size < 5 * 1024 * 1024) {
    try {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (e) {
      console.warn('Could not read file as data URL', e);
    }
  }

  // If text/code file under 1MB, read text content
  if (
    (category === 'code' || category === 'document') &&
    (file.type.includes('text') || file.name.match(/\.(txt|md|js|ts|py|json|sql|html|css)$/i)) &&
    file.size < 1024 * 1024
  ) {
    try {
      content = await file.text();
    } catch (e) {
      console.warn('Could not read text content', e);
    }
  }

  const newItem: LibraryItem = {
    id: `lib_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: customTitle?.trim() || file.name,
    type: category,
    fileType: displayType,
    fileSize: file.size,
    fileName: file.name,
    dataUrl,
    content,
    createdAt: now,
    updatedAt: now,
    source: 'Upload',
  };

  const current = getStoredLibraryItems();
  const updated = [newItem, ...current];
  saveStoredLibraryItems(updated);
  return newItem;
}

/**
 * Creates a real bookmark link record.
 */
export function createBookmarkItem(url: string, title?: string): LibraryItem {
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
  }

  let finalTitle = title?.trim();
  if (!finalTitle) {
    try {
      const parsed = new URL(cleanUrl);
      finalTitle = parsed.hostname.replace(/^www\./, '');
      if (parsed.pathname && parsed.pathname.length > 1) {
        finalTitle += parsed.pathname;
      }
    } catch (e) {
      finalTitle = cleanUrl;
    }
  }

  const now = new Date().toISOString();
  const newItem: LibraryItem = {
    id: `lib_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: finalTitle,
    type: 'bookmark',
    fileType: 'Link',
    url: cleanUrl,
    createdAt: now,
    updatedAt: now,
    source: 'Saved Link',
  };

  const current = getStoredLibraryItems();
  const updated = [newItem, ...current];
  saveStoredLibraryItems(updated);
  return newItem;
}

/**
 * Creates a real Note / Document record.
 */
export function createNoteItem(title: string, content: string): LibraryItem {
  const cleanTitle = title.trim() || 'Untitled Note';
  const cleanContent = content.trim();
  const now = new Date().toISOString();
  const approximateSize = new Blob([cleanTitle + cleanContent]).size;

  const newItem: LibraryItem = {
    id: `lib_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: cleanTitle,
    type: 'document',
    fileType: 'Note',
    content: cleanContent,
    fileSize: approximateSize,
    createdAt: now,
    updatedAt: now,
    source: 'Manual Note',
  };

  const current = getStoredLibraryItems();
  const updated = [newItem, ...current];
  saveStoredLibraryItems(updated);
  return newItem;
}

/**
 * Creates a real Code Snippet record.
 */
export function createCodeItem(title: string, code: string, language: string = 'TypeScript'): LibraryItem {
  const cleanTitle = title.trim() || 'Code Snippet';
  const cleanCode = code.trim();
  const now = new Date().toISOString();
  const approximateSize = new Blob([cleanTitle + cleanCode]).size;

  const newItem: LibraryItem = {
    id: `lib_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: cleanTitle,
    type: 'code',
    fileType: language,
    language: language,
    content: cleanCode,
    fileSize: approximateSize,
    createdAt: now,
    updatedAt: now,
    source: 'Code Snippet',
  };

  const current = getStoredLibraryItems();
  const updated = [newItem, ...current];
  saveStoredLibraryItems(updated);
  return newItem;
}

/**
 * Updates an existing library item.
 */
export function updateLibraryItem(
  id: string,
  updates: Partial<Omit<LibraryItem, 'id' | 'createdAt'>>
): LibraryItem | null {
  const current = getStoredLibraryItems();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const now = new Date().toISOString();

  const updatedItem: LibraryItem = {
    ...existing,
    ...updates,
    updatedAt: now,
  };

  current[index] = updatedItem;
  saveStoredLibraryItems([...current]);
  return updatedItem;
}

/**
 * Deletes an item from the library.
 */
export function deleteLibraryItem(id: string): boolean {
  const current = getStoredLibraryItems();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredLibraryItems(filtered);
  return true;
}

/**
 * Formats file size in bytes to B, KB, MB, or GB.
 */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || bytes === 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Formats timestamp for display (e.g., "Aug 17, 2025 · 10:42 AM").
 */
export function formatLibraryTimestamp(isoString: string): { date: string; time: string } {
  if (!isoString) return { date: '', time: '' };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: '', time: '' };

    const dateStr = d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const timeStr = d.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return { date: dateStr, time: timeStr };
  } catch (e) {
    return { date: '', time: '' };
  }
}

/**
 * Calculates storage used from real items.
 */
export function calculateLibraryStorage(items: LibraryItem[]): {
  usedBytes: number;
  formattedUsed: string;
  maxBytes: number;
  percentage: number;
} {
  const totalBytes = items.reduce((acc, item) => acc + (item.fileSize || 0), 0);
  const maxBytes = 1 * 1024 * 1024 * 1024; // 1 GB quota
  const percentage = Math.min(100, Math.round((totalBytes / maxBytes) * 100));

  let formattedUsed = '0 KB';
  if (totalBytes > 0) {
    if (totalBytes < 1024 * 1024) {
      formattedUsed = `${(totalBytes / 1024).toFixed(1)} KB`;
    } else {
      formattedUsed = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  }

  return {
    usedBytes: totalBytes,
    formattedUsed,
    maxBytes,
    percentage,
  };
}

/**
 * Calculates category counts from real items.
 */
export function calculateCategoryCounts(items: LibraryItem[]): {
  documents: number;
  bookmarks: number;
  images: number;
  code: number;
} {
  return {
    documents: items.filter((i) => i.type === 'document').length,
    bookmarks: items.filter((i) => i.type === 'bookmark').length,
    images: items.filter((i) => i.type === 'image').length,
    code: items.filter((i) => i.type === 'code').length,
  };
}
