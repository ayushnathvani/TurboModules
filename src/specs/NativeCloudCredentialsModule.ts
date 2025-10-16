/**
 * TurboModule Spec for Cloud Credentials Management
 * Handles secure cloud storage and retrieval of login credentials with Google Cloud
 */

import { NativeModules } from 'react-native';

// Interface for cloud credential data
export interface CloudCredential {
  username: string;
  password: string;
  deviceId: string;
  timestamp: number;
  lastSync: number;
}

// Interface for cloud sync status
export interface CloudSyncStatus {
  isConnected: boolean;
  lastSyncTime: number;
  hasCloudData: boolean;
  deviceCount: number;
}

// Module interface - defines the cloud storage methods
interface CloudCredentialsModuleType {
  // Save credentials to Google Cloud (with device-specific encryption)
  saveCredentialsToCloud(username: string, password: string): Promise<boolean>;

  // Get credentials from Google Cloud for current device
  getCredentialsFromCloud(username: string): Promise<string | null>;

  // Get all cloud credentials for this device
  getAllCloudCredentials(): Promise<CloudCredential[]>;

  // Sync local credentials to cloud
  syncToCloud(): Promise<boolean>;

  // Sync from cloud to local storage
  syncFromCloud(): Promise<boolean>;

  // Get cloud sync status
  getCloudSyncStatus(): Promise<CloudSyncStatus>;

  // Check if cloud connectivity is available
  isCloudAvailable(): Promise<boolean>;

  // Get unique device identifier
  getDeviceId(): Promise<string>;

  // Remove credentials from cloud
  removeCredentialsFromCloud(username: string): Promise<boolean>;

  // Get credentials for all devices (admin function)
  getAllDeviceCredentials(): Promise<CloudCredential[]>;
}

export default NativeModules.CloudCredentialsModule as CloudCredentialsModuleType;
