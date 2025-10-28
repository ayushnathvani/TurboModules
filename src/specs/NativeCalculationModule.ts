import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

interface Spec extends TurboModule {
  fibonacci(n: number): Promise<number>;
  primeFactors(n: number): Promise<number[]>;
  matrixMultiplication(size: number): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CalculationModule');
