import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import ClipboardModule from '../specs/NativeClipboardModule';
import ClipboardModuleLegacy from '../legacy/ClipboardModuleLegacy';

const ClipboardTab = () => {
  const [inputText, setInputText] = useState('Hello TurboModules!');
  const [turboResult, setTurboResult] = useState<string>('');
  const [legacyResult, setLegacyResult] = useState<string>('');
  const [turboSetTime, setTurboSetTime] = useState<number>(0);
  const [legacySetTime, setLegacySetTime] = useState<number>(0);
  const [turboGetTime, setTurboGetTime] = useState<number>(0);
  const [legacyGetTime, setLegacyGetTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const testTurboModule = async () => {
    setLoading(true);

    // Test Set
    const setStart = performance.now();
    try {
      await ClipboardModule.setString(inputText);
      const setEnd = performance.now();
      setTurboSetTime(setEnd - setStart);
    } catch (error) {
      console.error('TurboModule set error:', error);
    }

    // Test Get
    const getStart = performance.now();
    try {
      const result = await ClipboardModule.getString();
      const getEnd = performance.now();
      setTurboResult(result);
      setTurboGetTime(getEnd - getStart);
    } catch (error) {
      console.error('TurboModule get error:', error);
      setTurboResult('Error getting clipboard');
    }

    setLoading(false);
  };

  const testLegacyModule = async () => {
    setLoading(true);

    // Test Set
    const setStart = performance.now();
    try {
      await ClipboardModuleLegacy.setString(inputText);
      const setEnd = performance.now();
      setLegacySetTime(setEnd - setStart);
    } catch (error) {
      console.error('Legacy module set error:', error);
    }

    // Test Get
    const getStart = performance.now();
    try {
      const result = await ClipboardModuleLegacy.getString();
      const getEnd = performance.now();
      setLegacyResult(result);
      setLegacyGetTime(getEnd - getStart);
    } catch (error) {
      console.error('Legacy module get error:', error);
      setLegacyResult('Error getting clipboard');
    }

    setLoading(false);
  };

  const testBoth = async () => {
    await testTurboModule();
    await testLegacyModule();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clipboard Module</Text>
      <Text style={styles.description}>
        Copy and paste text natively with performance comparison.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Text to Copy:</Text>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter text to copy"
          multiline
        />
      </View>

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
          </View>
          {turboSetTime > 0 ? (
            <View style={styles.clipboardInfo}>
              <View style={styles.operationRow}>
                <Text style={styles.operationLabel}>📝 Set:</Text>
                <Text style={styles.timeValue}>
                  {turboSetTime.toFixed(2)}ms
                </Text>
              </View>
              <View style={styles.operationRow}>
                <Text style={styles.operationLabel}>📋 Get:</Text>
                <Text style={styles.timeValue}>
                  {turboGetTime.toFixed(2)}ms
                </Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Retrieved Text:</Text>
                <Text style={styles.resultText}>{turboResult}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholder}>No data yet</Text>
          )}
        </View>

        <View style={[styles.resultCard, styles.legacyCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🐌 Without TurboModule</Text>
          </View>
          {legacySetTime > 0 ? (
            <View style={styles.clipboardInfo}>
              <View style={styles.operationRow}>
                <Text style={styles.operationLabel}>📝 Set:</Text>
                <Text style={styles.timeValue}>
                  {legacySetTime.toFixed(2)}ms
                </Text>
              </View>
              <View style={styles.operationRow}>
                <Text style={styles.operationLabel}>📋 Get:</Text>
                <Text style={styles.timeValue}>
                  {legacyGetTime.toFixed(2)}ms
                </Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Retrieved Text:</Text>
                <Text style={styles.resultText}>{legacyResult}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholder}>No data yet</Text>
          )}
        </View>

        {turboSetTime > 0 && legacySetTime > 0 && (
          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>Performance Comparison</Text>
            <Text style={styles.performanceText}>
              Set Operation: TurboModule is{' '}
              <Text style={styles.performanceHighlight}>
                {((legacySetTime / turboSetTime - 1) * 100).toFixed(1)}% faster
              </Text>
            </Text>
            <Text style={styles.performanceText}>
              Get Operation: TurboModule is{' '}
              <Text style={styles.performanceHighlight}>
                {((legacyGetTime / turboGetTime - 1) * 100).toFixed(1)}% faster
              </Text>
            </Text>
            <Text style={styles.performanceDetail}>
              Total time saved:{' '}
              {(
                legacySetTime +
                legacyGetTime -
                (turboSetTime + turboGetTime)
              ).toFixed(2)}
              ms
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
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
  clipboardInfo: {
    gap: 12,
  },
  operationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  operationLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  resultBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
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
    marginBottom: 4,
  },
  performanceHighlight: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  performanceDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});

export default ClipboardTab;
