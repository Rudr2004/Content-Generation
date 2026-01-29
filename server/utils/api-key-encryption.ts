/**
 * API Key Encryption Utility
 * 
 * Provides secure encryption/decryption for API keys using AES-256-GCM
 * with SHA-256 key derivation from environment variable.
 * 
 * Security Features:
 * - AES-256-GCM encryption (authenticated encryption)
 * - SHA-256 key derivation from master key
 * - Random IV for each encryption
 * - Authentication tag to prevent tampering
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits

/**
 * Get encryption key from environment variable
 * Falls back to a default key if not set (for development only)
 */
function getEncryptionKey(): Buffer {
  const masterKey = process.env.API_KEY_ENCRYPTION_KEY || process.env.JWT_SECRET || 'default-encryption-key-change-in-production';
  
  // Derive a consistent 256-bit key using SHA-256
  return crypto.createHash('sha256').update(masterKey).digest();
}

/**
 * Encrypt an API key
 * @param plaintextApiKey - The API key to encrypt
 * @returns Encrypted string in format: salt:iv:tag:encryptedData (all base64)
 */
export function encryptApiKey(plaintextApiKey: string): string {
  if (!plaintextApiKey || plaintextApiKey.trim() === '') {
    throw new Error('API key cannot be empty');
  }

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the API key
    let encrypted = cipher.update(plaintextApiKey, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get authentication tag
    const tag = cipher.getAuthTag();
    
    // Combine salt, iv, tag, and encrypted data
    const result = [
      salt.toString('base64'),
      iv.toString('base64'),
      tag.toString('base64'),
      encrypted
    ].join(':');
    
    return result;
  } catch (error) {
    console.error('Error encrypting API key:', error);
    throw new Error('Failed to encrypt API key');
  }
}

/**
 * Decrypt an API key
 * @param encryptedApiKey - The encrypted API key string
 * @returns Decrypted API key
 */
export function decryptApiKey(encryptedApiKey: string): string {
  if (!encryptedApiKey || encryptedApiKey.trim() === '') {
    throw new Error('Encrypted API key cannot be empty');
  }

  try {
    const key = getEncryptionKey();
    const parts = encryptedApiKey.split(':');
    
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted API key format');
    }
    
    const [saltBase64, ivBase64, tagBase64, encrypted] = parts;
    
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    // Decrypt the API key
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting API key:', error);
    throw new Error('Failed to decrypt API key. Key may be corrupted or encrypted with different key.');
  }
}

/**
 * Mask API key for display (shows only last 4 characters)
 * @param apiKey - The API key to mask
 * @returns Masked string (e.g., "sk-...xxxx")
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length <= 4) {
    return '••••';
  }
  return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
}

/**
 * Check if a string appears to be an encrypted API key
 * (encrypted keys have format: salt:iv:tag:data)
 */
export function isEncrypted(apiKey: string): boolean {
  if (!apiKey) return false;
  const parts = apiKey.split(':');
  return parts.length === 4 && parts.every(part => {
    try {
      Buffer.from(part, 'base64');
      return true;
    } catch {
      return false;
    }
  });
}

/** True if string looks like a masked key (e.g. "AIza...x2I" or "pLrp...FZg="). Never treat as plaintext. */
export function isMaskedKey(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return value.includes('...');
}
