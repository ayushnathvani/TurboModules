import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import NetworkInfoModule from '../specs/NativeNetworkInfoModule';
import NetworkInfoModuleLegacy from '../legacy/NetworkInfoModuleLegacy';

const NetworkInfoTab = () => {
  const [turboResult, setTurboResult] = useState<any>(null);
  const [legacyResult, setLegacyResult] = useState<any>(null);
  const [turboTime, setTurboTime] = useState<number>(0);
  const [legacyTime, setLegacyTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const testTurboModule = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const result = await NetworkInfoModule.getNetworkInfo();
      const end = performance.now();
      setTurboResult(result);
      setTurboTime(end - start);
    } catch (error) {
      console.error('TurboModule error:', error);
      setTurboResult({ error: 'Failed to get network info' });
    }
    setLoading(false);
  };

  const testLegacyModule = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const result = await NetworkInfoModuleLegacy.getNetworkInfo();
      const end = performance.now();
      setLegacyResult(result);
      setLegacyTime(end - start);
    } catch (error) {
      console.error('Legacy module error:', error);
      setLegacyResult({ error: 'Failed to get network info' });
    }
    setLoading(false);
  };

  const testBoth = async () => {
    await testTurboModule();
    await testLegacyModule();
  };

  const getNetworkIcon = (type: string) => {
    switch (type) {
      case 'wifi':
        return '📶';
      case 'cellular':
        return '📱';
      case 'ethernet':
        return '🔌';
      case 'none':
        return '🚫';
      default:
        return '❓';
    }
  };

  const getConnectionColor = (isConnected: boolean) => {
    return isConnected ? '#4CAF50' : '#F44336';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Info Module</Text>
      <Text style={styles.description}>
        Get current network type (WiFi, cellular, etc.) and connection status.
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
            <View style={styles.networkInfo}>
              <Text style={styles.networkIcon}>
                {getNetworkIcon(turboResult.type)}
              </Text>
              <Text style={styles.networkType}>
                {turboResult.type?.toUpperCase()}
              </Text>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: getConnectionColor(
                        turboResult.isConnected,
                      ),
                    },
                  ]}
                />
                <Text style={styles.statusText}>
                  {turboResult.isConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <InfoRow
                  label="Internet Reachable"
                  value={turboResult.isInternetReachable ? 'Yes' : 'No'}
                />
              </View>
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
            <View style={styles.networkInfo}>
              <Text style={styles.networkIcon}>
                {getNetworkIcon(legacyResult.type)}
              </Text>
              <Text style={styles.networkType}>
                {legacyResult.type?.toUpperCase()}
              </Text>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: getConnectionColor(
                        legacyResult.isConnected,
                      ),
                    },
                  ]}
                />
                <Text style={styles.statusText}>
                  {legacyResult.isConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <InfoRow
                  label="Internet Reachable"
                  value={legacyResult.isInternetReachable ? 'Yes' : 'No'}
                />
              </View>
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
  networkInfo: {
    alignItems: 'center',
  },
  networkIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  networkType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    width: '100%',
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

export default NetworkInfoTab;
