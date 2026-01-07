/**
 * Web Crypto API Token Encryption Utilities
 * Uses AES-GCM for authenticated encryption of YAZIO tokens
 */

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a new AES-GCM encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Export a CryptoKey to a string format for storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

/**
 * Import a CryptoKey from a string format
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(keyString);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-GCM
 * @param data - The data to encrypt (will be JSON stringified)
 * @param key - The encryption key
 * @returns Object containing encrypted data and IV as base64 strings
 */
export async function encryptToken<T>(
  data: T,
  key: CryptoKey
): Promise<{ data: string; iv: string }> {
  // Generate a random initialization vector
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert data to JSON and then to ArrayBuffer
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  // Encrypt the data
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  );

  return {
    data: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedData - Base64 encoded encrypted data
 * @param ivString - Base64 encoded initialization vector
 * @param key - The decryption key
 * @returns The decrypted and parsed data
 */
export async function decryptToken<T>(
  encryptedData: string,
  ivString: string,
  key: CryptoKey
): Promise<T> {
  // Convert base64 strings back to ArrayBuffers
  const iv = base64ToArrayBuffer(ivString);
  const data = base64ToArrayBuffer(encryptedData);

  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  // Convert ArrayBuffer back to string and parse JSON
  const decoded = new TextDecoder().decode(decrypted);
  return JSON.parse(decoded);
}
