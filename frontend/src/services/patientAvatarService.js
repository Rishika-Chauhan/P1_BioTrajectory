/**
 * BioTrajectory Patient Avatar & Photo Upload Service
 *
 * Provides client-side photo processing, local persistence,
 * and reactive synchronization across the patient profile, digital ID card,
 * navigation headers, and doctor practice directories.
 */

export const DEFAULT_PATIENT_PHOTO =
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80';

const AVATAR_STORAGE_KEY = 'bt_patient_avatar';
const AVATAR_EVENT_NAME = 'bt_avatar_changed';

/**
 * Get current patient avatar from localStorage or fallback
 */
export function getPatientAvatar(fallback = DEFAULT_PATIENT_PHOTO) {
  try {
    const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (stored && stored.trim().length > 0) {
      return stored;
    }
  } catch {}
  return fallback;
}

/**
 * Save new patient avatar photo (Data URL or image URL)
 */
export function savePatientAvatar(dataUrl) {
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AVATAR_EVENT_NAME, { detail: dataUrl }));
    }
    return true;
  } catch (err) {
    console.error('Failed to save patient avatar:', err);
    return false;
  }
}

/**
 * Reset patient avatar to default
 */
export function resetPatientAvatar() {
  try {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AVATAR_EVENT_NAME, { detail: DEFAULT_PATIENT_PHOTO }));
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Subscribe to avatar changes across components
 */
export function subscribeToAvatarChanges(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback(getPatientAvatar());
  };

  window.addEventListener(AVATAR_EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(AVATAR_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Process and compress an uploaded image file into a lightweight Data URL.
 * Automatically scales down large photos (e.g. 10MB mobile uploads) to fit comfortably.
 */
export function processImageFile(file, maxWidth = 320, maxHeight = 320, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPEG, PNG, WebP)'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within maxWidth/maxHeight
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Clear background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load selected image file'));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
