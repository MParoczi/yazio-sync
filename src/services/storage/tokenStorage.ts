/**
 * Encrypted Token Storage
 * Manages secure storage of YAZIO authentication tokens
 */

import {
  generateKey,
  exportKey,
  importKey,
  encryptToken,
  decryptToken,
} from '../../utils/encryption';
import { STORAGE_KEYS } from '../../utils/constants';
import type { Token } from '../../types';

/**
 * Generate and store encryption key
 * Key is stored in sessionStorage (cleared on browser close)
 */
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  // Check if key already exists in sessionStorage
  const existingKey = sessionStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);

  if (existingKey) {
    try {
      return await importKey(existingKey);
    } catch (error) {
      console.warn('Failed to import existing key, generating new one:', error);
    }
  }

  // Generate new key
  const newKey = await generateKey();
  const exportedKey = await exportKey(newKey);
  sessionStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, exportedKey);

  return newKey;
}

/**
 * Store encrypted token in localStorage
 * @param token - YAZIO API token to store
 * @param rememberMe - Whether to persist the token
 */
export async function storeToken(
  token: Token,
  rememberMe: boolean
): Promise<void> {
  if (!rememberMe) {
    // If not "remember me", just store key in sessionStorage
    // Token will be lost when browser closes
    return;
  }

  try {
    const key = await getOrCreateEncryptionKey();
    const encrypted = await encryptToken(token, key);

    // Store encrypted data and IV in localStorage
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_TOKEN, encrypted.data);
    localStorage.setItem(STORAGE_KEYS.ENCRYPTION_IV, encrypted.iv);
  } catch (error) {
    console.error('Failed to store token:', error);
    throw new Error('Failed to securely store authentication token');
  }
}

/**
 * Retrieve and decrypt token from localStorage
 * Returns null if not found, expired, or decryption fails
 */
export async function retrieveToken(): Promise<Token | null> {
  try {
    const encryptedData = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_TOKEN);
    const iv = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_IV);
    const keyString = sessionStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);

    // All three must exist
    if (!encryptedData || !iv || !keyString) {
      return null;
    }

    // Import key and decrypt token
    const key = await importKey(keyString);
    const token = await decryptToken<Token>(encryptedData, iv, key);

    return token;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    // Clear corrupted data
    clearToken();
    return null;
  }
}

/**
 * Clear stored token and encryption key
 */
export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ENCRYPTION_IV);
  sessionStorage.removeItem(STORAGE_KEYS.ENCRYPTION_KEY);
}

/**
 * Check if token exists in storage
 */
export function hasStoredToken(): boolean {
  return (
    localStorage.getItem(STORAGE_KEYS.ENCRYPTED_TOKEN) !== null &&
    localStorage.getItem(STORAGE_KEYS.ENCRYPTION_IV) !== null &&
    sessionStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY) !== null
  );
}
