import { NativeModules } from 'react-native';

const { CalculationModuleLegacy } = NativeModules;

export default {
  fibonacci: (n: number): Promise<number> => {
    return CalculationModuleLegacy.fibonacci(n);
  },
  primeFactors: (n: number): Promise<number[]> => {
    return CalculationModuleLegacy.primeFactors(n);
  },
  matrixMultiplication: (size: number): Promise<number> => {
    return CalculationModuleLegacy.matrixMultiplication(size);
  },
};
