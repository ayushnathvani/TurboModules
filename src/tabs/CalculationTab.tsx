import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import CalculationModule from '../specs/NativeCalculationModule';
import CalculationModuleLegacy from '../legacy/CalculationModuleLegacy';

type TestType = 'fibonacci' | 'primeFactors' | 'matrix';

const CalculationTab = () => {
  const [activeTest, setActiveTest] = useState<TestType>('fibonacci');
  const [turboResult, setTurboResult] = useState<any>(null);
  const [legacyResult, setLegacyResult] = useState<any>(null);
  const [turboTime, setTurboTime] = useState<number>(0);
  const [legacyTime, setLegacyTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const testTurboModule = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      let result;
      switch (activeTest) {
        case 'fibonacci':
          result = await CalculationModule.fibonacci(40);
          break;
        case 'primeFactors':
          result = await CalculationModule.primeFactors(123456789);
          break;
        case 'matrix':
          result = await CalculationModule.matrixMultiplication(100);
          break;
      }
      const end = performance.now();
      setTurboResult(result);
      setTurboTime(end - start);
    } catch (error) {
      console.error('TurboModule error:', error);
      setTurboResult({ error: 'Calculation failed' });
    }
    setLoading(false);
  };

  const testLegacyModule = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      let result;
      switch (activeTest) {
        case 'fibonacci':
          result = await CalculationModuleLegacy.fibonacci(40);
          break;
        case 'primeFactors':
          result = await CalculationModuleLegacy.primeFactors(123456789);
          break;
        case 'matrix':
          result = await CalculationModuleLegacy.matrixMultiplication(100);
          break;
      }
      const end = performance.now();
      setLegacyResult(result);
      setLegacyTime(end - start);
    } catch (error) {
      console.error('Legacy module error:', error);
      setLegacyResult({ error: 'Calculation failed' });
    }
    setLoading(false);
  };

  const testBoth = async () => {
    setTurboResult(null);
    setLegacyResult(null);
    await testTurboModule();
    await testLegacyModule();
  };

  const formatResult = (result: any) => {
    if (Array.isArray(result)) {
      return `[${result.join(', ')}]`;
    }
    return result?.toString();
  };

  const getTestDescription = () => {
    switch (activeTest) {
      case 'fibonacci':
        return 'Calculate 40th Fibonacci number';
      case 'primeFactors':
        return 'Find prime factors of 123,456,789';
      case 'matrix':
        return 'Multiply two 100x100 matrices';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Calculation Module</Text>
      <Text style={styles.description}>
        Run heavy calculations natively for performance comparison.
      </Text>

      <View style={styles.testSelector}>
        <Text style={styles.selectorLabel}>Select Test:</Text>
        <View style={styles.testButtons}>
          <TouchableOpacity
            style={[
              styles.testButton,
              activeTest === 'fibonacci' && styles.activeTestButton,
            ]}
            onPress={() => setActiveTest('fibonacci')}
          >
            <Text
              style={[
                styles.testButtonText,
                activeTest === 'fibonacci' && styles.activeTestButtonText,
              ]}
            >
              Fibonacci
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.testButton,
              activeTest === 'primeFactors' && styles.activeTestButton,
            ]}
            onPress={() => setActiveTest('primeFactors')}
          >
            <Text
              style={[
                styles.testButtonText,
                activeTest === 'primeFactors' && styles.activeTestButtonText,
              ]}
            >
              Prime Factors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.testButton,
              activeTest === 'matrix' && styles.activeTestButton,
            ]}
            onPress={() => setActiveTest('matrix')}
          >
            <Text
              style={[
                styles.testButtonText,
                activeTest === 'matrix' && styles.activeTestButtonText,
              ]}
            >
              Matrix Mult
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.testDescription}>{getTestDescription()}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={testBoth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Run Performance Test</Text>
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
          {turboResult !== null ? (
            <View style={styles.calcInfo}>
              <Text style={styles.resultLabel}>Result:</Text>
              <Text style={styles.resultValue} numberOfLines={3}>
                {formatResult(turboResult)}
              </Text>
              <View style={styles.speedometer}>
                <Text style={styles.speedometerIcon}>⚡</Text>
                <Text style={styles.speedometerText}>Fast Execution</Text>
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
          {legacyResult !== null ? (
            <View style={styles.calcInfo}>
              <Text style={styles.resultLabel}>Result:</Text>
              <Text style={styles.resultValue} numberOfLines={3}>
                {formatResult(legacyResult)}
              </Text>
              <View style={styles.speedometer}>
                <Text style={styles.speedometerIcon}>🐢</Text>
                <Text style={styles.speedometerText}>Slower Execution</Text>
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
            <Text style={styles.performanceNote}>
              💡 Heavy calculations show the most dramatic performance
              improvements with TurboModules!
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
  testSelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  testButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  testButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTestButton: {
    backgroundColor: '#007AFF',
  },
  testButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTestButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  testDescription: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
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
  calcInfo: {
    gap: 12,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  speedometer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  speedometerIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  speedometerText: {
    fontSize: 14,
    color: '#666',
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
    marginTop: 4,
  },
  performanceNote: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default CalculationTab;
