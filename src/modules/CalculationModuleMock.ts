// Mock TurboModule for testing
export default {
  fibonacci: async (n: number): Promise<number> => {
    // Simple JS implementation for mock
    if (n <= 1) return n;
    let a = 0,
      b = 1;
    for (let i = 2; i <= n; i++) {
      const c = a + b;
      a = b;
      b = c;
    }
    return b;
  },
  primeFactors: async (n: number): Promise<number[]> => {
    return [3, 3, 3607, 3803]; // Mock factors of 123456789
  },
  matrixMultiplication: async (size: number): Promise<number> => {
    return 123456.789; // Mock result
  },
};
