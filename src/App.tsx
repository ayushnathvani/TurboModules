import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import DeviceInfoTab from './tabs/DeviceInfoTab';
import NetworkInfoTab from './tabs/NetworkInfoTab';
import CalculationTab from './tabs/CalculationTab';
import BatteryStatusTab from './tabs/BatteryStatusTab';
import ClipboardTab from './tabs/ClipboardTab';
import FlatListTab from './tabs/FlatListTab';
import LocationTab from './tabs/LocationTab';
import LoginTab from './tabs/LoginTab';

type TabName =
  | 'login'
  | 'device'
  | 'battery'
  | 'clipboard'
  | 'network'
  | 'calculation'
  | 'location';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabName>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');

  const handleLoginSuccess = (username: string) => {
    setLoggedInUser(username);
    setIsLoggedIn(true);
    setActiveTab('device'); // Switch to first tab after login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser('');
    setActiveTab('login');
  };

  const renderTabContent = () => {
    if (!isLoggedIn) {
      return <LoginTab onLoginSuccess={handleLoginSuccess} />;
    }

    switch (activeTab) {
      case 'device':
        return <DeviceInfoTab />;
      case 'battery':
        return <BatteryStatusTab />;
      case 'clipboard':
        return <ClipboardTab />;
      case 'network':
        return <NetworkInfoTab />;
      case 'calculation':
        return <CalculationTab />;
      case 'location':
        return <LocationTab />;
      default:
        return <DeviceInfoTab />;
    }
  };

  const tabs = [
    { id: 'device' as TabName, label: 'Device Info' },
    { id: 'battery' as TabName, label: 'Battery' },
    { id: 'clipboard' as TabName, label: 'Clipboard' },
    { id: 'network' as TabName, label: 'Network' },
    { id: 'calculation' as TabName, label: 'Calculation' },
    { id: 'location' as TabName, label: 'Location' },
  ];

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <LoginTab onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>TurboModules Demo</Text>
            <Text style={styles.headerSubtitle}>Welcome, {loggedInUser}!</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexGrow: 0,
    flexShrink: 0,
  },
  tabBarContent: {
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default App;
