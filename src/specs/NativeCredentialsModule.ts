/**
 * TurboModule Spec for Credentials Management
 * Handles secure storage and retrieval of login credentials with suggestions like Facebook
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

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
interface Spec extends TurboModule {
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

export default TurboModuleRegistry.getEnforcing<Spec>('CredentialsModule');
