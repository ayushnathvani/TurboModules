import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import CredentialsModule, {
  CredentialSuggestion,
  StoredCredential,
} from '../specs/NativeCredentialsModule';
import CloudCredentialsModule, {
  CloudCredential,
  CloudSyncStatus,
} from '../specs/NativeCloudCredentialsModule';

interface LoginTabProps {
  onLoginSuccess?: (username: string) => void;
}

const LoginTab: React.FC<LoginTabProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [suggestions, setSuggestions] = useState<CredentialSuggestion[]>([]);
  const [storedCredentials, setStoredCredentials] = useState<
    StoredCredential[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showStoredCredentials, setShowStoredCredentials] = useState(true);
  const [loading, setLoading] = useState(false);

  // Cloud state
  const [cloudCredentials, setCloudCredentials] = useState<CloudCredential[]>(
    [],
  );
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>({
    isConnected: false,
    lastSyncTime: 0,
    hasCloudData: false,
    deviceCount: 0,
  });
  const [isCloudAvailable, setIsCloudAvailable] = useState(false);

  // Load username suggestions and stored credentials on component mount
  useEffect(() => {
    loadSuggestions();
    loadStoredCredentials();
    checkCloudAvailability();
    loadCloudSyncStatus();
    loadCloudCredentials();
  }, []);

  // Auto-fill password when username changes
  useEffect(() => {
    if (username.length > 0) {
      checkForStoredPassword(username);
      setShowSuggestions(false);
      setShowStoredCredentials(false);
    } else {
      setPassword('');
      setShowStoredCredentials(true);
    }
  }, [username]);

  const loadSuggestions = async () => {
    try {
      const usernameSuggestions =
        await CredentialsModule.getUsernameSuggestions();
      setSuggestions(usernameSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const loadStoredCredentials = async () => {
    try {
      const credentials = await CredentialsModule.getAllStoredCredentials();
      setStoredCredentials(credentials.slice(0, 5)); // Show max 5 recent credentials like Facebook
    } catch (error) {
      console.error('Failed to load stored credentials:', error);
    }
  };

  // Cloud functions
  const checkCloudAvailability = async () => {
    try {
      const available = await CloudCredentialsModule.isCloudAvailable();
      setIsCloudAvailable(available);
    } catch (error) {
      console.error('Failed to check cloud availability:', error);
      setIsCloudAvailable(false);
    }
  };

  const loadCloudSyncStatus = async () => {
    try {
      const status = await CloudCredentialsModule.getCloudSyncStatus();
      setCloudSyncStatus(status);
    } catch (error) {
      console.error('Failed to load cloud sync status:', error);
    }
  };

  const loadCloudCredentials = async () => {
    try {
      const credentials = await CloudCredentialsModule.getAllCloudCredentials();
      setCloudCredentials(credentials);
    } catch (error) {
      console.error('Failed to load cloud credentials:', error);
    }
  };

  const syncToCloud = async () => {
    try {
      const success = await CloudCredentialsModule.syncToCloud();
      if (success) {
        loadCloudSyncStatus();
        Alert.alert('Success', 'Credentials synced to cloud successfully!');
      }
    } catch (error) {
      console.error('Failed to sync to cloud:', error);
      Alert.alert('Error', 'Failed to sync to cloud. Please try again.');
    }
  };

  const syncFromCloud = async () => {
    try {
      const success = await CloudCredentialsModule.syncFromCloud();
      if (success) {
        loadStoredCredentials();
        loadCloudSyncStatus();
        Alert.alert('Success', 'Credentials synced from cloud successfully!');
      }
    } catch (error) {
      console.error('Failed to sync from cloud:', error);
      Alert.alert('Error', 'Failed to sync from cloud. Please try again.');
    }
  };

  const checkForStoredPassword = async (usernameToCheck: string) => {
    try {
      const storedPassword = await CredentialsModule.getPassword(
        usernameToCheck,
      );
      if (storedPassword) {
        setPassword(storedPassword);
      }
    } catch (error) {
      console.error('Failed to get stored password:', error);
    }
  };

  const handleUsernamePress = () => {
    setShowSuggestions(true);
    setShowStoredCredentials(false);
  };

  const selectSuggestion = async (suggestion: CredentialSuggestion) => {
    setUsername(suggestion.username);
    setShowSuggestions(false);
    setShowStoredCredentials(false);

    // Auto-fill password for selected username
    try {
      const storedPassword = await CredentialsModule.getPassword(
        suggestion.username,
      );
      if (storedPassword) {
        setPassword(storedPassword);
      }
    } catch (error) {
      console.error('Failed to get password for suggestion:', error);
    }
  };

  const quickLogin = async (credential: StoredCredential) => {
    setLoading(true);

    try {
      // Update last used timestamp
      await CredentialsModule.updateLastUsed(credential.username);

      // Simulate login process
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Quick Login Successful',
          `Welcome back, ${credential.username}!`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (onLoginSuccess) {
                  onLoginSuccess(credential.username);
                }
              },
            },
          ],
        );
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Quick login failed');
      console.error('Quick login error:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      // Save credentials locally (never removed)
      await CredentialsModule.saveCredentials(username.trim(), password);

      // Also save to cloud if available
      if (isCloudAvailable) {
        try {
          await CloudCredentialsModule.saveCredentialsToCloud(
            username.trim(),
            password,
          );
          console.log('Credentials also saved to cloud');
        } catch (cloudError) {
          console.warn(
            'Failed to save to cloud, but local save succeeded:',
            cloudError,
          );
        }
      }

      // Simulate login process
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Login Successful', `Welcome, ${username}!`, [
          {
            text: 'OK',
            onPress: () => {
              if (onLoginSuccess) {
                onLoginSuccess(username);
              }
              // Reset form and reload suggestions
              setUsername('');
              setPassword('');
              setShowStoredCredentials(true);
              loadSuggestions();
              loadStoredCredentials();
              loadCloudCredentials();
              loadCloudSyncStatus();
            },
          },
        ]);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to save credentials');
      console.error('Login error:', error);
    }
  };

  const renderSuggestionItem = ({ item }: { item: CredentialSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => selectSuggestion(item)}
    >
      <Text style={styles.suggestionText}>{item.username}</Text>
      <Text style={styles.suggestionDate}>
        Last used: {new Date(item.lastUsed * 1000).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const renderCredentialItem = ({ item }: { item: StoredCredential }) => (
    <TouchableOpacity
      style={styles.credentialCard}
      onPress={() => quickLogin(item)}
    >
      <View style={styles.credentialAvatar}>
        <Text style={styles.credentialAvatarText}>
          {item.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.credentialInfo}>
        <Text style={styles.credentialUsername}>{item.username}</Text>
        <Text style={styles.credentialSubtext}>Tap to login</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Welcome to TurboModules</Text>
          <Text style={styles.subtitle}>Login with persistent credentials</Text>

          {/* Stored Credentials (Facebook-like) */}
          {showStoredCredentials && storedCredentials.length > 0 && (
            <View style={styles.storedCredentialsContainer}>
              <Text style={styles.sectionTitle}>Recent logins</Text>
              <FlatList
                data={storedCredentials}
                keyExtractor={item => item.username}
                renderItem={renderCredentialItem}
                showsVerticalScrollIndicator={false}
                style={styles.credentialsList}
              />
              <Text style={styles.orText}>OR</Text>
            </View>
          )}

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TouchableOpacity onPress={handleUsernamePress}>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={handleUsernamePress}
              />
            </TouchableOpacity>

            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={suggestions}
                  keyExtractor={item => item.username}
                  renderItem={renderSuggestionItem}
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Cloud Sync Section */}
          {isCloudAvailable && (
            <View style={styles.cloudSyncContainer}>
              <Text style={styles.sectionTitle}>Cloud Sync</Text>
              <Text style={styles.cloudStatusText}>
                Status:{' '}
                {cloudSyncStatus.isConnected
                  ? '🟢 Connected'
                  : '🔴 Disconnected'}
              </Text>
              <Text style={styles.cloudStatusText}>
                Devices: {cloudSyncStatus.deviceCount}
              </Text>
              <View style={styles.cloudButtonsContainer}>
                <TouchableOpacity
                  style={styles.cloudButton}
                  onPress={syncToCloud}
                >
                  <Text style={styles.cloudButtonText}>↑ Backup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cloudButton}
                  onPress={syncFromCloud}
                >
                  <Text style={styles.cloudButtonText}>↓ Restore</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🔒 Your credentials are stored securely and never removed
            </Text>
            <Text style={styles.infoText}>
              💾 Username suggestions stored locally on device
            </Text>
            <Text style={styles.infoText}>
              ☁️{' '}
              {isCloudAvailable
                ? 'Cloud backup enabled - survives app data clearing'
                : 'Cloud backup unavailable'}
            </Text>
            <Text style={styles.infoText}>
              ⚡ TurboModule provides ultra-fast credential access
            </Text>
            <Text style={styles.infoText}>
              📱 Facebook-like quick login experience
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  storedCredentialsContainer: {
    marginBottom: 30,
  },
  credentialsList: {
    maxHeight: 250,
  },
  credentialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  credentialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  credentialAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  credentialInfo: {
    flex: 1,
  },
  credentialUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  credentialSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  suggestionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#999',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  cloudSyncContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cloudStatusText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  cloudButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cloudButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 0.48,
  },
  cloudButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoginTab;
