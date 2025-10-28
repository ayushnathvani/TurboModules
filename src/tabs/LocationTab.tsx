import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

import NativeLocationModule from '../specs/NativeLocationModule';
import LocationModuleLegacy from '../legacy/LocationModuleLegacy';

const LocationTab = () => {
  const [turboLocation, setTurboLocation] = useState<any>(null);
  const [legacyLocation, setLegacyLocation] = useState<any>(null);
  const [thirdPartyLocation, setThirdPartyLocation] = useState<any>(null);
  const [turboTime, setTurboTime] = useState<number>(0);
  const [legacyTime, setLegacyTime] = useState<number>(0);
  const [thirdPartyTime, setThirdPartyTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [isWarmedUp, setIsWarmedUp] = useState(false);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        console.log('Requesting Android location permission...');
        
        // First check if we already have permission
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        console.log('Permission already granted:', alreadyGranted);
        if (alreadyGranted) {
          return true;
        }

        // Request permission with clear explanation
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message:
              'This app needs location access to demonstrate TurboModule performance. ' +
              'This is only for testing purposes and data stays on your device.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          },
        );
        
        console.log('Permission request result:', granted);
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        
        if (!isGranted) {
          // Also try requesting coarse location as fallback
          const coarseGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
              title: 'Location Permission Required',
              message: 'Please grant location access for this demo to work.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'Allow',
            },
          );
          return coarseGranted === PermissionsAndroid.RESULTS.GRANTED;
        }
        
        return isGranted;
      } catch (err) {
        console.error('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS permissions handled in Info.plist
  };

  // Third-party geolocation function using @react-native-community/geolocation
  const getCurrentPosition = useCallback(
    (): Promise<GeolocationResponse> =>
      new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
        );
      }),
    [],
  );

  const getTurboLocation = async () => {
    setLoading(true);
    try {
      // Check if TurboModule is available
      if (!NativeLocationModule) {
        setTurboLocation({ error: 'TurboModule not available' });
        setLoading(false);
        return;
      }

      // Warm up TurboModule on first call to eliminate lazy loading overhead
      if (!isWarmedUp) {
        try {
          console.log('Warming up TurboModule...');
          await NativeLocationModule.requestLocationPermission();
          setIsWarmedUp(true);
        } catch (warmupError) {
          console.warn('TurboModule warmup failed:', warmupError);
        }
      }

      // Request permission first
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setTurboLocation({
          error: 'Location permission not granted. Please enable in Settings.',
        });
        setLoading(false);
        return;
      }

      // Multiple measurements for accuracy (excluding first slow call)
      const measurements = [];
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        const result = await NativeLocationModule.getCurrentLocation();
        const end = performance.now();
        measurements.push(end - start);

        // Use the last result
        if (i === 2) {
          setTurboLocation(result);
        }

        // Small delay between measurements
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Use average of measurements
      const avgTime =
        measurements.reduce((a, b) => a + b, 0) / measurements.length;
      setTurboTime(avgTime);
    } catch (error: any) {
      console.error('TurboModule location error:', error);
      setTurboLocation({
        error: `TurboModule error: ${
          error.message || 'Failed to get location'
        }`,
      });
    }
    setLoading(false);
  };

  const getLegacyLocation = async () => {
    setLoading(true);
    try {
      // Check if Legacy module is available
      if (!LocationModuleLegacy) {
        setLegacyLocation({ error: 'Legacy module not available' });
        setLoading(false);
        return;
      }

      // Request permission first
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLegacyLocation({
          error: 'Location permission not granted. Please enable in Settings.',
        });
        setLoading(false);
        return;
      }

      const start = performance.now();
      const result = await LocationModuleLegacy.getCurrentLocation();
      const end = performance.now();
      setLegacyLocation(result);
      setLegacyTime(end - start);
    } catch (error: any) {
      console.error('Legacy location error:', error);
      setLegacyLocation({
        error: `Legacy module error: ${
          error.message || 'Failed to get location'
        }`,
      });
    }
    setLoading(false);
  };

  const getThirdPartyLocation = async () => {
    setLoading(true);
    try {
      // Request permission first
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setThirdPartyLocation({
          error: 'Location permission not granted. Please enable in Settings.',
        });
        setLoading(false);
        return;
      }

      const start = performance.now();

      // Use the actual @react-native-community/geolocation library
      const position = await getCurrentPosition();

      const end = performance.now();

      // Extract location data from the response
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };

      setThirdPartyLocation(locationData);
      setThirdPartyTime(end - start);
    } catch (error: any) {
      console.error('Third-party location error:', error);
      setThirdPartyLocation({
        error: `Third-party library error: ${
          error.message || 'Failed to get location'
        }`,
      });
      setThirdPartyTime(0);
    }
    setLoading(false);
  };

  const testAll = async () => {
    // Clear previous results
    setTurboLocation(null);
    setLegacyLocation(null);
    setThirdPartyLocation(null);
    setTurboTime(0);
    setLegacyTime(0);
    setThirdPartyTime(0);

    // Test each implementation with delays to prevent crashes
    try {
      await getTurboLocation();
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

      await getLegacyLocation();
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

      await getThirdPartyLocation();
    } catch (error) {
      console.error('Error during location testing:', error);
    }
  };

  const renderLocation = (
    data: any,
    title: string,
    time: number,
    borderColor: string,
  ) => {
    if (!data) return null;
    return (
      <View style={[styles.resultCard, { borderColor }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          {time > 0 && <Text style={styles.timeText}>{time.toFixed(2)}ms</Text>}
        </View>
        {data.error ? (
          <Text style={styles.errorText}>{data.error}</Text>
        ) : (
          <View style={styles.locationDetails}>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Latitude:</Text>
              <Text style={styles.locationValue}>
                {data.latitude?.toFixed(6)}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Longitude:</Text>
              <Text style={styles.locationValue}>
                {data.longitude?.toFixed(6)}
              </Text>
            </View>
            {data.accuracy && (
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>Accuracy:</Text>
                <Text style={styles.locationValue}>
                  {data.accuracy.toFixed(2)}m
                </Text>
              </View>
            )}
            {data.altitude && (
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>Altitude:</Text>
                <Text style={styles.locationValue}>
                  {data.altitude.toFixed(2)}m
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // Find fastest implementation
  const times = [
    { name: 'TurboModule', time: turboTime, color: '#4CAF50' },
    { name: 'Third-party Library', time: thirdPartyTime, color: '#9C27B0' },
  ]
    .filter(t => t.time > 0)
    .sort((a, b) => a.time - b.time);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location/Geolocation Comparison</Text>
      <Text style={styles.description}>
        Compare location retrieval using TurboModule, Legacy Bridge, and
        Third-party Library (@react-native-community/geolocation).
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={testAll}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Test All 3 Implementations</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        {renderLocation(
          turboLocation,
          ' TurboModule (JSI)',
          turboTime,
          '#4CAF50',
        )}

        {renderLocation(legacyLocation, 'Legacy Bridge', legacyTime, '#FF9800')}

        {renderLocation(
          thirdPartyLocation,
          'Third-party Library',
          thirdPartyTime,
          '#9C27B0',
        )}

        {times.length === 3 && (
          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>Performance Ranking</Text>
            {times.map((item, index) => (
              <View key={item.name} style={styles.rankingItem}>
                <Text style={styles.rankingNumber}>#{index + 1}</Text>
                <Text style={[styles.rankingName, { color: item.color }]}>
                  {item.name}
                </Text>
                <Text style={styles.rankingTime}>{item.time.toFixed(2)}ms</Text>
                {index === 0 && <Text style={styles.winnerIcon}></Text>}
                {index === 1 && <Text style={styles.winnerIcon}></Text>}
                {index === 2 && <Text style={styles.winnerIcon}></Text>}
              </View>
            ))}

            <View style={styles.comparisonDetails}>
              <Text style={styles.comparisonTitle}>Speed Comparison:</Text>
              <Text style={styles.comparisonText}>
                • TurboModule vs Legacy:{' '}
                {turboTime < legacyTime
                  ? `${((legacyTime / turboTime - 1) * 100).toFixed(1)}% faster`
                  : `${((turboTime / legacyTime - 1) * 100).toFixed(
                      1,
                    )}% slower`}
              </Text>
              <Text style={styles.comparisonText}>
                • TurboModule vs Third-party:{' '}
                {turboTime < thirdPartyTime
                  ? `${((thirdPartyTime / turboTime - 1) * 100).toFixed(
                      1,
                    )}% faster`
                  : `${((turboTime / thirdPartyTime - 1) * 100).toFixed(
                      1,
                    )}% slower`}
              </Text>
              <Text style={styles.comparisonText}>
                • Legacy vs Third-party:{' '}
                {legacyTime < thirdPartyTime
                  ? `${((thirdPartyTime / legacyTime - 1) * 100).toFixed(
                      1,
                    )}% faster`
                  : `${((legacyTime / thirdPartyTime - 1) * 100).toFixed(
                      1,
                    )}% slower`}
              </Text>
            </View>

            <Text style={styles.performanceNote}>
              💡 TurboModules provide direct JSI access, while legacy and
              third-party libraries go through the bridge (slower).
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', marginBottom: 20 },
  buttonContainer: { marginBottom: 20 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  individualButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  smallButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  turboButton: { backgroundColor: '#4CAF50' },
  legacyButton: { backgroundColor: '#FF9800' },
  thirdPartyButton: { backgroundColor: '#9C27B0' },
  smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  resultsContainer: { gap: 16 },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  locationDetails: { gap: 8 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    width: 120,
  },
  locationValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    fontFamily: 'monospace',
  },
  performanceCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
    textAlign: 'center',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    marginVertical: 2,
  },
  rankingNumber: { fontSize: 16, fontWeight: 'bold', color: '#333', width: 30 },
  rankingName: { flex: 1, fontSize: 14, fontWeight: '600', marginLeft: 8 },
  rankingTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  winnerIcon: { fontSize: 18 },
  comparisonDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  comparisonText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  performanceNote: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LocationTab;
