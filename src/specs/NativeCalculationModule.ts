import { NativeModules } from 'react-native';

interface CalculationModuleType {
  fibonacci(n: number): Promise<number>;
  primeFactors(n: number): Promise<number[]>;
  matrixMultiplication(size: number): Promise<number>;
}

export default NativeModules.CalculationModule as CalculationModuleType;
