/**
 * TurboModule Spec for Google Password Manager Integration
 * Handles secure credential storage and retrieval using Google Password Manager
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// Interface for password manager credential data
export interface PasswordManagerCredential {
  type: 'password' | 'google';
  username?: string;
  password?: string;
  id?: string;
  displayName?: string;
  profilePictureUri?: string;
  idToken?: string;
}

// Interface for password manager suggestion
export interface PasswordManagerSuggestion {
  username: string;
  type: string;
  lastUsed: number;
}

// Interface for password manager status
export interface PasswordManagerStatus {
  isAvailable: boolean;
  isConnected: boolean;
  lastSyncTime: number;
  hasCredentials: boolean;
  provider: string;
  apiLevel: number;
}

// Legacy interfaces for backward compatibility
export interface CloudCredential {
  username: string;
  password: string;
  deviceId: string;
  timestamp: number;
  lastSync: number;
}

export interface CloudSyncStatus {
  isConnected: boolean;
  lastSyncTime: number;
  hasCloudData: boolean;
  deviceCount: number;
}

// Module interface - defines the password manager methods
interface CloudCredentialsModuleType {
  // New Google Password Manager methods
  saveCredentialsToPasswordManager(
    username: string,
    password: string,
  ): Promise<boolean>;
  getCredentialsFromPasswordManager(): Promise<PasswordManagerCredential | null>;
  showPasswordManagerPickerDialog(): Promise<PasswordManagerCredential | null>;
  getPasswordManagerSuggestions(): Promise<PasswordManagerSuggestion[]>;
  isPasswordManagerAvailable(): Promise<boolean>;
  getPasswordManagerStatus(): Promise<PasswordManagerStatus>;
  clearPasswordManagerCredentials(): Promise<boolean>;

  // Legacy methods for backward compatibility (now using Password Manager)
  saveCredentialsToCloud(username: string, password: string): Promise<boolean>;
  getCredentialsFromCloud(username: string): Promise<string | null>;
  getAllCloudCredentials(): Promise<CloudCredential[]>;
  syncToCloud(): Promise<boolean>;
  syncFromCloud(): Promise<boolean>;
  getCloudSyncStatus(): Promise<CloudSyncStatus>;
  isCloudAvailable(): Promise<boolean>;
  getDeviceId(): Promise<string>;
  removeCredentialsFromCloud(username: string): Promise<boolean>;
  getAllDeviceCredentials(): Promise<CloudCredential[]>;

  // Add this new test method
  testPasswordManagerSetup(): Promise<{
    status: string;
    apiLevel: number;
    device: string;
    gmsAvailable: boolean;
    gmsVersion: string;
    hasActivity: boolean;
  }>;
}

export default TurboModuleRegistry.getEnforcing<CloudCredentialsModuleType>(
  'CloudCredentialsModule',
);
