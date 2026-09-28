// Offline Local Deck Storage using browser memory + IndexedDB fallback for zero-internet presentation serving
const DB_NAME = 'smart_hackathon_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'offline_decks';

export interface StoredDeckRecord {
  teamId: string;
  fileName: string;
  fileType: string;
  fileData: Blob | File;
  fileSize: string;
  uploadedAt: string;
}

// In-memory store ensures zero-failure operation even inside restrictive iframes, private browsing, or when IndexedDB is blocked
const inMemoryStore = new Map<string, StoredDeckRecord>();
const objectUrlCache = new Map<string, string>();

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'teamId' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
    } catch (e) {
      reject(e);
    }
  });
}

export async function saveLocalDeck(
  teamId: string,
  file: File | Blob,
  customFileName?: string
): Promise<{ blobUrl: string; fileName: string; fileSize: string; fileType: string }> {
  const fileName = customFileName || (file instanceof File ? file.name : `Deck_${teamId}.pdf`);
  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const fileType = file.type || (isPdf ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

  const record: StoredDeckRecord = {
    teamId,
    fileName,
    fileType,
    fileData: file,
    fileSize: fileSizeMb,
    uploadedAt: new Date().toISOString()
  };

  // 1. Immediately store in-memory (guaranteed to succeed in any iframe/browser)
  inMemoryStore.set(teamId, record);

  // 2. Revoke previous blob URL if exists and create a fresh one
  const oldUrl = objectUrlCache.get(teamId);
  if (oldUrl) {
    try {
      URL.revokeObjectURL(oldUrl);
    } catch {
      // ignore
    }
  }

  let blobUrl = '';
  try {
    blobUrl = URL.createObjectURL(file);
    objectUrlCache.set(teamId, blobUrl);
  } catch (err) {
    console.warn('URL.createObjectURL failed:', err);
  }

  // 3. Persist to IndexedDB in background (best effort, will not crash if blocked)
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB persistence note (in-memory copy active):', e);
  }

  return { blobUrl, fileName, fileSize: fileSizeMb, fileType };
}

export async function getLocalDeck(
  teamId: string
): Promise<{ blobUrl: string; fileName: string; fileSize: string; fileType: string; fileData?: Blob | File } | null> {
  // 1. Check active objectUrlCache & inMemoryStore first (fastest & most reliable)
  const memRecord = inMemoryStore.get(teamId);
  const cachedUrl = objectUrlCache.get(teamId);

  if (memRecord) {
    let url = cachedUrl;
    if (!url) {
      try {
        url = URL.createObjectURL(memRecord.fileData);
        objectUrlCache.set(teamId, url);
      } catch {
        // ignore
      }
    }
    return {
      blobUrl: url || '',
      fileName: memRecord.fileName,
      fileSize: memRecord.fileSize,
      fileType: memRecord.fileType,
      fileData: memRecord.fileData
    };
  }

  if (cachedUrl) {
    return {
      blobUrl: cachedUrl,
      fileName: 'Local Offline Presentation',
      fileSize: 'Cached',
      fileType: 'application/pdf'
    };
  }

  // 2. Try IndexedDB if not in memory
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(teamId);
        req.onsuccess = () => {
          const record = req.result as StoredDeckRecord | undefined;
          if (!record || !record.fileData) {
            resolve(null);
            return;
          }
          // Put in memory store for fast repeated access
          inMemoryStore.set(teamId, record);
          const blobUrl = URL.createObjectURL(record.fileData);
          objectUrlCache.set(teamId, blobUrl);
          resolve({
            blobUrl,
            fileName: record.fileName,
            fileSize: record.fileSize,
            fileType: record.fileType,
            fileData: record.fileData
          });
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch (err) {
    console.warn('Failed to retrieve local offline deck from IndexedDB:', err);
    return null;
  }
}

export async function deleteLocalDeck(teamId: string): Promise<void> {
  try {
    const oldUrl = objectUrlCache.get(teamId);
    if (oldUrl) {
      URL.revokeObjectURL(oldUrl);
      objectUrlCache.delete(teamId);
    }
    inMemoryStore.delete(teamId);

    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(teamId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete local deck:', err);
  }
}

export async function listAllLocalDeckTeamIds(): Promise<string[]> {
  const ids = new Set<string>(inMemoryStore.keys());
  try {
    const db = await openDatabase();
    const idbKeys = await new Promise<string[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve((req.result as string[]) || []);
      req.onerror = () => reject(req.error);
    });
    idbKeys.forEach((k) => ids.add(k));
  } catch {
    // ignore
  }
  return Array.from(ids);
}
