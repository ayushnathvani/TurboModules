import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DeviceInfoModule from '../specs/NativeDeviceInfoModule';
import DeviceInfoModuleLegacy from '../legacy/DeviceInfoModuleLegacy';

const DeviceInfoTab = () => {
  const [turboResult, setTurboResult] = useState<any>(null);
  const [legacyResult, setLegacyResult] = useState<any>(null);
  const [turboTime, setTurboTime] = useState<number>(0);
  const [legacyTime, setLegacyTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const testTurboModule = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const result = await DeviceInfoModule.getDeviceInfo();
      const end = performance.now();
      setTurboResult(result);
      setTurboTime(end - start);
    } catch (error) {
      console.error('TurboModule error:', error);
      setTurboResult({ error: 'Failed to get device info' });
    }
    setLoading(false);
  };

  const testLegacyModule = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const result = await DeviceInfoModuleLegacy.getDeviceInfo();
      const end = performance.now();
      setLegacyResult(result);
      setLegacyTime(end - start);
    } catch (error) {
      console.error('Legacy module error:', error);
      setLegacyResult({ error: 'Failed to get device info' });
    }
    setLoading(false);
  };

  const testBoth = async () => {
    await testTurboModule();
    await testLegacyModule();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Information Module</Text>
      <Text style={styles.description}>
        Get device model, manufacturer, OS version, and more.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={testBoth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Test Both Implementations</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        <View style={styles.resultCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>✨ With TurboModule</Text>
            {turboTime > 0 && (
              <Text style={styles.timeText}>{turboTime.toFixed(2)}ms</Text>
            )}
          </View>
          {turboResult ? (
            <View style={styles.infoContainer}>
              <InfoRow label="Model" value={turboResult.model} />
              <InfoRow label="Manufacturer" value={turboResult.manufacturer} />
              <InfoRow label="Brand" value={turboResult.brand} />
              <InfoRow label="OS Version" value={turboResult.osVersion} />
              <InfoRow label="Device ID" value={turboResult.deviceId} />
            </View>
          ) : (
            <Text style={styles.placeholder}>No data yet</Text>
          )}
        </View>

        <View style={[styles.resultCard, styles.legacyCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🐌 Without TurboModule</Text>
            {legacyTime > 0 && (
              <Text style={styles.timeText}>{legacyTime.toFixed(2)}ms</Text>
            )}
          </View>
          {legacyResult ? (
            <View style={styles.infoContainer}>
              <InfoRow label="Model" value={legacyResult.model} />
              <InfoRow label="Manufacturer" value={legacyResult.manufacturer} />
              <InfoRow label="Brand" value={legacyResult.brand} />
              <InfoRow label="OS Version" value={legacyResult.osVersion} />
              <InfoRow label="Device ID" value={legacyResult.deviceId} />
            </View>
          ) : (
            <Text style={styles.placeholder}>No data yet</Text>
          )}
        </View>

        {turboTime > 0 && legacyTime > 0 && (
          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>Performance Comparison</Text>
            <Text style={styles.performanceText}>
              TurboModule is{' '}
              <Text style={styles.performanceHighlight}>
                {((legacyTime / turboTime - 1) * 100).toFixed(1)}% faster
              </Text>
            </Text>
            <Text style={styles.performanceDetail}>
              Time saved: {(legacyTime - turboTime).toFixed(2)}ms
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    gap: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  legacyCard: {
    borderColor: '#FF9800',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
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
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 14,
    color: '#333',
  },
  performanceHighlight: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  performanceDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default DeviceInfoTab;
