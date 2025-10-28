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
  Image,
} from 'react-native';
import CredentialsModule, {
  CredentialSuggestion,
  StoredCredential,
} from '../specs/NativeCredentialsModule';
import CloudCredentialsModule, {
  PasswordManagerCredential,
  PasswordManagerSuggestion,
  PasswordManagerStatus,
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

  // Validation state
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password Manager state
  const [passwordManagerSuggestions, setPasswordManagerSuggestions] = useState<
    PasswordManagerSuggestion[]
  >([]);
  const [passwordManagerStatus, setPasswordManagerStatus] =
    useState<PasswordManagerStatus>({
      isAvailable: false,
      isConnected: false,
      lastSyncTime: 0,
      hasCredentials: false,
      provider: 'Google Password Manager',
      apiLevel: 0,
    });
  const [isPasswordManagerAvailable, setIsPasswordManagerAvailable] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load username suggestions and stored credentials on component mount
  useEffect(() => {
    loadSuggestions();
    loadStoredCredentials();
    checkPasswordManagerAvailability();
    loadPasswordManagerStatus();
    loadPasswordManagerSuggestions();
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

  // Validation functions
  const validateUsername = (username: string): string => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.trim().length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (username.trim().length > 20) {
      return 'Username must be less than 20 characters';
    }
    // Check for valid characters (alphanumeric, underscore, dot)
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(username.trim())) {
      return 'Username can only contain letters, numbers, underscores, and dots';
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password.length > 50) {
      return 'Password must be less than 50 characters';
    }
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return 'Password must contain at least one letter and one number';
    }
    return '';
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    // Clear error when user starts typing
    if (usernameError) {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const validateForm = (): boolean => {
    const usernameValidationError = validateUsername(username);
    const passwordValidationError = validatePassword(password);

    setUsernameError(usernameValidationError);
    setPasswordError(passwordValidationError);

    return !usernameValidationError && !passwordValidationError;
  };

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

  // Password Manager functions
  const checkPasswordManagerAvailability = async () => {
    try {
      const available =
        await CloudCredentialsModule.isPasswordManagerAvailable();
      setIsPasswordManagerAvailable(available);
    } catch (error) {
      console.error('Failed to check password manager availability:', error);
      setIsPasswordManagerAvailable(false);
    }
  };

  const loadPasswordManagerStatus = async () => {
    try {
      const status = await CloudCredentialsModule.getPasswordManagerStatus();
      setPasswordManagerStatus(status);
    } catch (error) {
      console.error('Failed to load password manager status:', error);
    }
  };

  const loadPasswordManagerSuggestions = async () => {
    try {
      const pmSuggestions =
        await CloudCredentialsModule.getPasswordManagerSuggestions();
      setPasswordManagerSuggestions(pmSuggestions);
    } catch (error) {
      console.error('Failed to load password manager suggestions:', error);
    }
  };

  const getCredentialsFromPasswordManager = async () => {
    try {
      const credential =
        await CloudCredentialsModule.getCredentialsFromPasswordManager();
      if (credential) {
        if (
          credential.type === 'password' &&
          credential.username &&
          credential.password
        ) {
          setUsername(credential.username);
          setPassword(credential.password);
          // Clear any validation errors
          setUsernameError('');
          setPasswordError('');
          Alert.alert(
            'Credential Retrieved',
            `Loaded credentials for ${credential.username}`,
          );
        } else if (credential.type === 'google' && credential.displayName) {
          setUsername(credential.displayName);
          setUsernameError('');
          Alert.alert(
            'Google Account',
            `Retrieved Google account: ${credential.displayName}`,
          );
        }
      }
    } catch (error) {
      console.error('Failed to get credentials from password manager:', error);
      Alert.alert(
        'Error',
        'Failed to retrieve credentials from password manager',
      );
    }
  };

  const showPasswordManagerPicker = async () => {
    try {
      console.log('Explicitly showing Password Manager picker...');
      const credential =
        await CloudCredentialsModule.showPasswordManagerPickerDialog();
      if (credential) {
        if (
          credential.type === 'password' &&
          credential.username &&
          credential.password
        ) {
          setUsername(credential.username);
          setPassword(credential.password);
          // Clear any validation errors
          setUsernameError('');
          setPasswordError('');
          Alert.alert(
            'Credential Selected',
            `Selected credentials for ${credential.username}`,
          );
        }
      } else {
        Alert.alert(
          'No Credentials',
          'No credentials available or user cancelled selection',
        );
      }
    } catch (error) {
      console.error('Failed to show password manager picker:', error);
      Alert.alert('Error', 'Failed to show password manager picker');
    }
  };

  const testPasswordManagerSetup = async () => {
    try {
      const result = await CloudCredentialsModule.testPasswordManagerSetup();
      console.log('Password Manager Setup Test:', result);
      Alert.alert(
        'Setup Test Results',
        `API Level: ${result.apiLevel}\n` +
          `Device: ${result.device}\n` +
          `Google Play Services: ${
            result.gmsAvailable ? 'Available' : 'Not Available'
          }\n` +
          `GMS Version: ${result.gmsVersion}\n` +
          `Activity: ${result.hasActivity ? 'Available' : 'Missing'}`,
      );
    } catch (error) {
      console.error('Setup test failed:', error);
      Alert.alert('Setup Test Failed', String(error));
    }
  };

  const handleLogin = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save credentials locally (never removed)
      await CredentialsModule.saveCredentials(username.trim(), password);

      // Also save to Google Password Manager if available
      if (isPasswordManagerAvailable) {
        try {
          await CloudCredentialsModule.saveCredentialsToPasswordManager(
            username.trim(),
            password,
          );
          console.log('Credentials also saved to Google Password Manager');
        } catch (passwordManagerError) {
          console.warn(
            'Failed to save to Google Password Manager, but local save succeeded:',
            passwordManagerError,
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
              // Reset form and reload data
              setUsername('');
              setPassword('');
              setUsernameError('');
              setPasswordError('');
              setShowStoredCredentials(true);
              loadSuggestions();
              loadStoredCredentials();
              loadPasswordManagerSuggestions();
              loadPasswordManagerStatus();
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

  const checkForStoredPassword = async (usernameToCheck: string) => {
    try {
      const storedPassword = await CredentialsModule.getPassword(
        usernameToCheck,
      );
      if (storedPassword) {
        setPassword(storedPassword);
        setPasswordError(''); // Clear password error when auto-filled
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
    setUsernameError(''); // Clear username error when selecting suggestion
    setShowSuggestions(false);
    setShowStoredCredentials(false);

    // Auto-fill password for selected username
    try {
      const storedPassword = await CredentialsModule.getPassword(
        suggestion.username,
      );
      if (storedPassword) {
        setPassword(storedPassword);
        setPasswordError(''); // Clear password error when auto-filled
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
          <Text style={styles.subtitle}>Login with username</Text>

          {/* Google Password Manager Section */}

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
                style={[styles.input, usernameError ? styles.inputError : null]}
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="Enter username"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={handleUsernamePress}
              />
            </TouchableOpacity>
            {usernameError ? (
              <Text style={styles.errorText}>{usernameError}</Text>
            ) : null}

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

          {/* Password Input with Eye Icon */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.passwordInput, passwordError ? styles.inputError : null]}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Enter password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    showPassword
                      ? require('../assets/icons/eye.png') // Adjust path to your eye-on icon
                      : require('../assets/icons/eyeoff.png') // Adjust path to your eye-off icon
                  }
                  style={styles.eyeIconImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
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

          {/* Password Manager Status Section */}
          {/* {isPasswordManagerAvailable && (
            <View style={styles.passwordManagerStatusContainer}>
              <Text style={styles.sectionTitle}>Google Password Manager</Text>
              <Text style={styles.statusText}>
                Status:{' '}
                {passwordManagerStatus.isAvailable
                  ? '🟢 Available'
                  : '🔴 Unavailable'}
              </Text>
              <Text style={styles.statusText}>
                Provider: {passwordManagerStatus.provider}
              </Text>
              <Text style={styles.statusText}>
                API Level: {passwordManagerStatus.apiLevel}
              </Text>
            </View>
          )} */}

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🔒 Your credentials are stored securely with Google Password
              Manager
            </Text>
            <Text style={styles.infoText}>
              💾 Username suggestions stored locally on device
            </Text>
            <Text style={styles.infoText}>
              ☁️{' '}
              {isPasswordManagerAvailable
                ? 'Google Password Manager enabled - syncs across your devices'
                : 'Google Password Manager unavailable'}
            </Text>
            <Text style={styles.infoText}>
              ⚡ TurboModule provides ultra-fast credential access
            </Text>
            <Text style={styles.infoText}>
              📱 Facebook-like quick login experience
            </Text>
            <Text style={styles.infoText}>
              🔐 Secure autofill integration with Android system
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
  // Password Manager Styles
  passwordManagerContainer: {
    marginBottom: 25,
    padding: 16,
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  passwordManagerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordManagerButtonSecondary: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordManagerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordManagerStatusContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  statusText: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 8,
    fontWeight: '500',
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
    color: '#000',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  // Password input styles with eye icon
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    paddingRight: 50, // Make space for the eye icon
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    tintColor: '#666', // Optional: add tint color to match your design
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
});

export default LoginTab;
