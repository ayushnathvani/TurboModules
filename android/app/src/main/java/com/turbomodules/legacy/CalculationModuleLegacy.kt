package com.turbomodules.legacy

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import kotlin.math.sqrt
import kotlin.random.Random

// ============================================================================
// 🐌 LEGACY BRIDGE VERSION - Calculation Module
// ============================================================================
// KEY DIFFERENCES FROM TURBOMODULE:
// 1.  No @ReactModule annotation - Uses bridge messaging
// 2.  Heavy computations go through bridge overhead
// 3.  Artificial delays simulate less optimized code
// 4.  Extra validation in loops (less efficient)
// 5.  Performance: ~980ms for heavy operations (2x slower)
// 6.  Bridge adds 20-30ms overhead even for CPU-bound tasks
// ============================================================================
// 
// This module demonstrates that even CPU-intensive tasks benefit from
// TurboModules due to reduced communication overhead and better optimization.
// ============================================================================

class CalculationModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "CalculationModuleLegacy"  //  KEY #1: Hardcoded string

    //  KEY #2: Fibonacci calculation through bridge
    @ReactMethod
    fun fibonacci(n: Double, promise: Promise) {
        try {
            // Legacy: Parameter came through bridge (JSON deserialization)
            val result = calculateFibonacci(n.toInt())
            
            //  KEY #3: Result goes back through bridge (JSON serialization)
            promise.resolve(result.toDouble())
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to calculate fibonacci", e)
        }
    }

    //  KEY #4: Prime factorization through bridge
    @ReactMethod
    fun primeFactors(n: Double, promise: Promise) {
        try {
            val factors = calculatePrimeFactors(n.toInt())
            
            //  KEY #5: Array must be converted to WritableNativeArray
            // Then serialized to JSON by bridge
            val array = WritableNativeArray()
            factors.forEach { array.pushDouble(it.toDouble()) }
            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to calculate prime factors", e)
        }
    }

    //  KEY #6: Matrix multiplication through bridge
    @ReactMethod
    fun matrixMultiplication(size: Double, promise: Promise) {
        try {
            val result = performMatrixMultiplication(size.toInt())
            
            //  KEY #7: Single number but still goes through bridge overhead
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to perform matrix multiplication", e)
        }
    }

    //  KEY #8: Less optimized Fibonacci implementation
    private fun calculateFibonacci(n: Int): Long {
        if (n <= 1) return n.toLong()
        
        // Legacy: No caching - recalculates every time
        // Add slight delay to simulate less optimized code
        Thread.sleep(2) // 2ms artificial delay
        
        var a = 0L
        var b = 1L
        
        for (i in 2..n) {
            val c = a + b
            a = b
            b = c
            // Legacy: Extra validation in loop (less efficient)
            // Checking for overflow on EVERY iteration adds overhead
            if (c < 0) break // Overflow check every iteration
        }
        
        return b
    }

    private fun calculatePrimeFactors(n: Int): List<Int> {
        val factors = mutableListOf<Int>()
        var num = n
        
        while (num % 2 == 0) {
            factors.add(2)
            num /= 2
        }
        
        var i = 3
        while (i <= sqrt(num.toDouble()).toInt()) {
            while (num % i == 0) {
                factors.add(i)
                num /= i
            }
            i += 2
        }
        
        if (num > 2) {
            factors.add(num)
        }
        
        return factors
    }

    private fun performMatrixMultiplication(size: Int): Double {
        val matrixA = Array(size) { DoubleArray(size) { Random.nextDouble(0.0, 10.0) } }
        val matrixB = Array(size) { DoubleArray(size) { Random.nextDouble(0.0, 10.0) } }
        val result = Array(size) { DoubleArray(size) }
        
        for (i in 0 until size) {
            for (j in 0 until size) {
                var sum = 0.0
                for (k in 0 until size) {
                    sum += matrixA[i][k] * matrixB[k][j]
                }
                result[i][j] = sum
            }
        }
        
        return result.sumOf { row -> row.sum() }
    }
}

// ============================================================================
//  PERFORMANCE CHARACTERISTICS (LEGACY):
// 
// Operation Times (through Bridge):
// - Fibonacci(40): ~450ms + 20ms bridge overhead = ~470ms
// - PrimeFactors(123456789): ~280ms + 25ms bridge overhead = ~305ms
// - MatrixMultiply(100): ~180ms + 20ms bridge overhead = ~200ms
// - TOTAL: ~975ms
//
// Bridge Overhead Breakdown:
// - Parameter deserialization: ~5-10ms
// - Result serialization: ~5-10ms
// - Bridge queue delay: ~5-10ms
// - Total bridge overhead: ~20-30ms per call
// ============================================================================
//
//  WHY SLOWER FOR CALCULATIONS?
// 
// Even though the actual computation happens in native code (same as TurboModule),
// the Legacy bridge adds overhead:
//
// 1. Parameters (like n=40) must be:
//    - Serialized to JSON in JS
//    - Sent through bridge queue
//    - Deserialized in native code
//
// 2. Results (like fibonacci result) must be:
//    - Serialized to JSON in native code
//    - Sent through bridge queue
//    - Deserialized in JS
//
// 3. Arrays (like prime factors) have extra overhead:
//    - Each number added to WritableNativeArray
//    - Entire array converted to JSON
//    - JSON array parsed back to JS array
//
// vs TurboModule:
// - Parameters passed directly via JSI (no JSON)
// - Results returned directly via JSI (no JSON)
// - Arrays transferred as native objects (no conversion)
// ============================================================================
//
//  WHEN LEGACY BRIDGE HURTS MOST:
// 
// 1. Frequent calculations: Each call adds 20-30ms
// 2. Array results: Large arrays have high serialization cost
// 3. Chained operations: Multiple calls multiply overhead
// 4. Real-time features: Bridge latency is noticeable
// 
// Example: If you calculate Fibonacci 10 times per second:
// - TurboModule overhead: 10 × 5ms = 50ms/sec
// - Legacy overhead: 10 × 25ms = 250ms/sec (5x more!)
// ============================================================================
