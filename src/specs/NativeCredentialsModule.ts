/**
 * TurboModule Spec for Credentials Management
 * Handles secure storage and retrieval of login credentials with suggestions like Facebook
 */

import { NativeModules } from 'react-native';

// Interface for stored credential (with encrypted password)
export interface StoredCredential {
  username: string;
  password: string;
  timestamp: number; // When the credential was saved
}

// Interface for credential suggestions (username only for security)
export interface CredentialSuggestion {
  username: string;
  lastUsed: number;
}

// Module interface - defines the methods available
interface CredentialsModuleType {
  // Save username and password securely (never gets removed)
  saveCredentials(username: string, password: string): Promise<boolean>;

  // Get stored password for a specific username
  getPassword(username: string): Promise<string | null>;

  // Get list of username suggestions (sorted by last used, like Facebook)
  getUsernameSuggestions(): Promise<CredentialSuggestion[]>;

  // Get all stored credentials with passwords (for Facebook-like quick login)
  getAllStoredCredentials(): Promise<StoredCredential[]>;

  // Check if credentials exist for a username
  hasCredentials(username: string): Promise<boolean>;

  // Update last used timestamp for a username
  updateLastUsed(username: string): Promise<boolean>;
}

export default NativeModules.CredentialsModule as CredentialsModuleType;
