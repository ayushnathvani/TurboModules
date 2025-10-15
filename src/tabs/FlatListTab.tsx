import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import FlatListDataModule from '../specs/NativeFlatListDataModule';
import FlatListDataModuleLegacy from '../legacy/FlatListDataModuleLegacy';

interface DataItem {
  id: string;
  title: string;
  description: string;
  value: number;
  timestamp: number;
}

const FlatListTab = () => {
  const [turboData, setTurboData] = useState<DataItem[]>([]);
  const [legacyData, setLegacyData] = useState<DataItem[]>([]);
  const [turboDisplayData, setTurboDisplayData] = useState<DataItem[]>([]);
  const [legacyDisplayData, setLegacyDisplayData] = useState<DataItem[]>([]);
  const [turboTime, setTurboTime] = useState<number>(0);
  const [legacyTime, setLegacyTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [itemCount] = useState(1000); // Reduced from 5000 for better testing
  const [isWarmedUp, setIsWarmedUp] = useState(false);
  const [showTurboList, setShowTurboList] = useState(false);
  const [showLegacyList, setShowLegacyList] = useState(false);
  const [turboPage, setTurboPage] = useState(1);
  const [legacyPage, setLegacyPage] = useState(1);
  const [loadingMoreTurbo, setLoadingMoreTurbo] = useState(false);
  const [loadingMoreLegacy, setLoadingMoreLegacy] = useState(false);
  const ITEMS_PER_PAGE = 20;

  const testTurboModule = async () => {
    setLoading(true);
    setShowTurboList(false);
    setTurboPage(1);
    setTurboDisplayData([]);
    try {
      // Warm up on first call (only small warmup)
      if (!isWarmedUp) {
        await FlatListDataModule.generateData(10);
        setIsWarmedUp(true);
      }

      // Clear memory and force garbage collection
      setTurboData([]);

      // Multiple measurements for accuracy
      const measurements = [];
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        const result = await FlatListDataModule.generateData(itemCount);
        const end = performance.now();
        measurements.push(end - start);

        // Keep the last result
        if (i === 2) {
          setTurboData(result);
          setTurboDisplayData(result.slice(0, ITEMS_PER_PAGE));
        }

        // Small delay between measurements
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Use average of measurements
      const avgTime =
        measurements.reduce((a, b) => a + b, 0) / measurements.length;
      setTurboTime(avgTime);
    } catch (error) {
      console.error('TurboModule error:', error);
      setTurboData([]);
      setTurboDisplayData([]);
    }
    setLoading(false);
  };

  const testLegacyModule = async () => {
    setLoading(true);
    setShowLegacyList(false);
    setLegacyPage(1);
    setLegacyDisplayData([]);
    try {
      // Clear memory
      setLegacyData([]);

      // Multiple measurements for accuracy
      const measurements = [];
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        const result = await FlatListDataModuleLegacy.generateData(itemCount);
        const end = performance.now();
        measurements.push(end - start);

        // Keep the last result
        if (i === 2) {
          setLegacyData(result);
          setLegacyDisplayData(result.slice(0, ITEMS_PER_PAGE));
        }

        // Small delay between measurements
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Use average of measurements
      const avgTime =
        measurements.reduce((a, b) => a + b, 0) / measurements.length;
      setLegacyTime(avgTime);
    } catch (error) {
      console.error('Legacy module error:', error);
      setLegacyData([]);
      setLegacyDisplayData([]);
    }
    setLoading(false);
  };

  const loadMoreTurboData = () => {
    if (loadingMoreTurbo || turboDisplayData.length >= turboData.length) return;

    setLoadingMoreTurbo(true);
    setTimeout(() => {
      const nextPage = turboPage + 1;
      const startIndex = turboPage * ITEMS_PER_PAGE;
      const endIndex = nextPage * ITEMS_PER_PAGE;
      const newItems = turboData.slice(startIndex, endIndex);

      setTurboDisplayData([...turboDisplayData, ...newItems]);
      setTurboPage(nextPage);
      setLoadingMoreTurbo(false);
    }, 100);
  };

  const loadMoreLegacyData = () => {
    if (loadingMoreLegacy || legacyDisplayData.length >= legacyData.length)
      return;

    setLoadingMoreLegacy(true);
    setTimeout(() => {
      const nextPage = legacyPage + 1;
      const startIndex = legacyPage * ITEMS_PER_PAGE;
      const endIndex = nextPage * ITEMS_PER_PAGE;
      const newItems = legacyData.slice(startIndex, endIndex);

      setLegacyDisplayData([...legacyDisplayData, ...newItems]);
      setLegacyPage(nextPage);
      setLoadingMoreLegacy(false);
    }, 100);
  };

  const testBoth = async () => {
    setTurboData([]);
    setLegacyData([]);
    await testTurboModule();
    await testLegacyModule();
  };

  const renderItem = ({ item }: { item: DataItem }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription} numberOfLines={1}>
        {item.description}
      </Text>
      <Text style={styles.itemValue}>Value: {item.value}</Text>
    </View>
  );

  const renderFooter = (isLoading: boolean) => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlatList Data Generation</Text>
      <Text style={styles.description}>
        Generate {itemCount.toLocaleString()} items and compare data transfer
        performance.
      </Text>

      {!isWarmedUp && (
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            TurboModules use lazy loading - they initialize on first use. This
            test automatically warms up the module before measuring performance.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={testBoth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate Items</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        {/* TurboModule Result */}
        <View style={[styles.resultCard, { borderColor: '#4CAF50' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>✨ TurboModule</Text>
            {turboTime > 0 && (
              <Text style={styles.timeText}>{turboTime.toFixed(2)}ms</Text>
            )}
          </View>

          {turboData.length > 0 ? (
            <View style={styles.dataInfo}>
              <Text style={styles.dataCount}>
                {turboDisplayData.length.toLocaleString()} of{' '}
                {turboData.length.toLocaleString()} items
              </Text>
              <TouchableOpacity
                style={styles.showListButton}
                onPress={() => setShowTurboList(!showTurboList)}
              >
                <Text style={styles.showListButtonText}>
                  {showTurboList ? 'Hide List' : 'Show List'}
                </Text>
              </TouchableOpacity>

              {showTurboList && (
                <View style={styles.listContainer}>
                  <FlatList
                    data={turboDisplayData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    maxToRenderPerBatch={20}
                    windowSize={10}
                    initialNumToRender={ITEMS_PER_PAGE}
                    style={styles.flatList}
                    onEndReached={loadMoreTurboData}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter(loadingMoreTurbo)}
                    removeClippedSubviews={false}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={true}
                  />
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.placeholder}>No data yet</Text>
          )}
        </View>

        {/* Legacy Result */}
        <View style={[styles.resultCard, styles.legacyCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🐌 Legacy Bridge</Text>
            {legacyTime > 0 && (
              <Text style={styles.timeText}>{legacyTime.toFixed(2)}ms</Text>
            )}
          </View>

          {legacyData.length > 0 ? (
            <View style={styles.dataInfo}>
              <Text style={styles.dataCount}>
                {legacyDisplayData.length.toLocaleString()} of{' '}
                {legacyData.length.toLocaleString()} items
              </Text>
              <TouchableOpacity
                style={styles.showListButton}
                onPress={() => setShowLegacyList(!showLegacyList)}
              >
                <Text style={styles.showListButtonText}>
                  {showLegacyList ? 'Hide List' : 'Show List'}
                </Text>
              </TouchableOpacity>

              {showLegacyList && (
                <View style={styles.listContainer}>
                  <FlatList
                    data={legacyDisplayData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    maxToRenderPerBatch={20}
                    windowSize={10}
                    initialNumToRender={ITEMS_PER_PAGE}
                    style={styles.flatList}
                    onEndReached={loadMoreLegacyData}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter(loadingMoreLegacy)}
                    removeClippedSubviews={false}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={true}
                  />
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.placeholder}>No data yet</Text>
          )}
        </View>

        {/* Performance Comparison */}
        {turboTime > 0 && legacyTime > 0 && (
          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>
              📊 Performance Comparison
            </Text>
            <Text style={styles.performanceText}>
              TurboModule:{' '}
              <Text style={styles.timeHighlight}>{turboTime.toFixed(2)}ms</Text>
            </Text>
            <Text style={styles.performanceText}>
              Legacy Bridge:{' '}
              <Text style={styles.timeHighlight}>
                {legacyTime.toFixed(2)}ms
              </Text>
            </Text>
            <Text style={styles.performanceText}>
              Performance gain:{' '}
              <Text style={styles.performanceHighlight}>
                {turboTime < legacyTime
                  ? `${((legacyTime / turboTime - 1) * 100).toFixed(1)}% faster`
                  : `${((turboTime / legacyTime - 1) * 100).toFixed(
                      1,
                    )}% slower`}
              </Text>
            </Text>
            <Text style={styles.performanceDetail}>
              Winner:{' '}
              <Text style={styles.performanceHighlight}>
                {turboTime < legacyTime ? 'TurboModule ⚡' : 'Legacy Bridge 🐌'}
              </Text>
            </Text>
            <Text style={styles.performanceNote}>
              💡 TurboModules typically perform better due to direct JSI
              communication and reduced serialization overhead.
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD54F',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
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
  dataInfo: {
    gap: 12,
  },
  dataCount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  showListButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  showListButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    height: 250,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 4,
  },
  listItem: {
    minHeight: 60,
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 12,
    color: '#007AFF',
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
  timeHighlight: {
    fontWeight: 'bold',
    color: '#2196F3',
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
  footerLoader: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
});

export default FlatListTab;
