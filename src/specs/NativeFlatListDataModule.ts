/**
 * TurboModule Spec for FlatList Data Generation
 * Demonstrates performance difference in generating large datasets
 */

import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface DataItem {
  id: string;
  title: string;
  description: string;
  value: number;
  timestamp: number;
}

export interface Spec extends TurboModule {
  generateData(count: number): Promise<DataItem[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('FlatListDataModule');
