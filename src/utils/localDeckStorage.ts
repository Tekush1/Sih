// Offline Local Deck Storage using browser IndexedDB for zero-internet presentation serving
const DB_NAME = 'smart_hackathon_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'offline_decks';

interface StoredDeckRecord {
  teamId: string;
  fileName: string;
  fileType: string;
  fileData: Blob;
  fileSize: string;
  uploadedAt: string;
}

const objectUrlCache = new Map<string, string>();

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'teamId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocalDeck(
  teamId: string,
  file: File
): Promise<{ blobUrl: string; fileName: string; fileSize: string }> {
  const db = await openDatabase();
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

  const record: StoredDeckRecord = {
    teamId,
    fileName: file.name,
    fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
    fileData: file,
    fileSize: fileSizeMb,
    uploadedAt: new Date().toISOString()
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  // Revoke old URL if any
  const oldUrl = objectUrlCache.get(teamId);
  if (oldUrl) URL.revokeObjectURL(oldUrl);

  const blobUrl = URL.createObjectURL(file);
  objectUrlCache.set(teamId, blobUrl);

  return { blobUrl, fileName: file.name, fileSize: fileSizeMb };
}

export async function getLocalDeck(
  teamId: string
): Promise<{ blobUrl: string; fileName: string; fileSize: string } | null> {
  // Check memory cache first
  const cachedUrl = objectUrlCache.get(teamId);
  if (cachedUrl) {
    return { blobUrl: cachedUrl, fileName: 'Local Offline Presentation', fileSize: 'Cached' };
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(teamId);
      req.onsuccess = () => {
        const record = req.result as StoredDeckRecord | undefined;
        if (!record || !record.fileData) {
          resolve(null);
          return;
        }
        const blobUrl = URL.createObjectURL(record.fileData);
        objectUrlCache.set(teamId, blobUrl);
        resolve({
          blobUrl,
          fileName: record.fileName,
          fileSize: record.fileSize
        });
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to retrieve local offline deck:', err);
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
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve((req.result as string[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}
