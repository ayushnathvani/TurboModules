#import "CalculationModuleLegacy.h"

@implementation CalculationModuleLegacy

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(fibonacci:(double)n
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    long long result = [self calculateFibonacci:(int)n];
    resolve(@(result));
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to calculate fibonacci", nil);
  }
}

RCT_EXPORT_METHOD(primeFactors:(double)n
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSArray *factors = [self calculatePrimeFactors:(int)n];
    resolve(factors);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to calculate prime factors", nil);
  }
}

RCT_EXPORT_METHOD(matrixMultiplication:(double)size
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    double result = [self performMatrixMultiplication:(int)size];
    resolve(@(result));
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to perform matrix multiplication", nil);
  }
}

- (long long)calculateFibonacci:(int)n {
  if (n <= 1) return n;
  
  long long a = 0, b = 1, c;
  for (int i = 2; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  return b;
}

- (NSArray *)calculatePrimeFactors:(int)n {
  NSMutableArray *factors = [NSMutableArray array];
  
  while (n % 2 == 0) {
    [factors addObject:@2];
    n = n / 2;
  }
  
  for (int i = 3; i <= sqrt(n); i += 2) {
    while (n % i == 0) {
      [factors addObject:@(i)];
      n = n / i;
    }
  }
  
  if (n > 2) {
    [factors addObject:@(n)];
  }
  
  return factors;
}

- (double)performMatrixMultiplication:(int)size {
  // Seed random number generator with fixed value for consistent results
  srand(42);
  
  double **matrixA = (double **)malloc(size * sizeof(double *));
  double **matrixB = (double **)malloc(size * sizeof(double *));
  double **result = (double **)malloc(size * sizeof(double *));
  
  for (int i = 0; i < size; i++) {
    matrixA[i] = (double *)malloc(size * sizeof(double));
    matrixB[i] = (double *)malloc(size * sizeof(double));
    result[i] = (double *)malloc(size * sizeof(double));
    
    for (int j = 0; j < size; j++) {
      matrixA[i][j] = (double)(rand() % 10);
      matrixB[i][j] = (double)(rand() % 10);
      result[i][j] = 0.0;
    }
  }
  
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      for (int k = 0; k < size; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }
  
  double sum = 0.0;
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      sum += result[i][j];
    }
  }
  
  for (int i = 0; i < size; i++) {
    free(matrixA[i]);
    free(matrixB[i]);
    free(result[i]);
  }
  free(matrixA);
  free(matrixB);
  free(result);
  
  return sum;
}

@end
