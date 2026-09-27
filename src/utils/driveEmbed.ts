/**
 * Helper to convert various Google Drive, Google Slides, and cloud presentation URLs
 * into clean, reliable iframe embed URLs.
 */
export function getGoogleDriveEmbedUrl(rawUrl: string): { embedUrl: string; directUrl: string; isFolder: boolean } {
  if (!rawUrl) return { embedUrl: '', directUrl: '', isFolder: false };

  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Google Slides: https://docs.google.com/presentation/d/PRESENTATION_ID/...
  const slidesMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch) {
    const id = slidesMatch[1];
    return {
      embedUrl: `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000`,
      directUrl: url,
      isFolder: false
    };
  }

  // Google Drive File: https://drive.google.com/file/d/FILE_ID/...
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    const id = driveFileMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      directUrl: url,
      isFolder: false
    };
  }

  // Google Drive open?id=FILE_ID or uc?id=FILE_ID
  const driveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch) {
    const id = driveIdMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      directUrl: url,
      isFolder: false
    };
  }

  // Google Drive Folder: https://drive.google.com/drive/(u/0/)?folders/FOLDER_ID
  const folderMatch = url.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    const id = folderMatch[1];
    return {
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${id}#grid`,
      directUrl: url,
      isFolder: true
    };
  }

  // If already preview or embed
  if (url.includes('/preview') || url.includes('/embed')) {
    return {
      embedUrl: url,
      directUrl: url.replace('/preview', '/view').replace('/embed', '/edit'),
      isFolder: false
    };
  }

  // If general drive.google.com with /view
  if (url.includes('drive.google.com') && url.includes('/view')) {
    return {
      embedUrl: url.replace(/\/view(\?.*)?$/, '/preview'),
      directUrl: url,
      isFolder: false
    };
  }

  // Default fallback
  return {
    embedUrl: url,
    directUrl: url,
    isFolder: false
  };
}
