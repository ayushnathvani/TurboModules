package com.turbomodules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.module.annotations.ReactModule
import kotlin.math.sqrt
import kotlin.random.Random

@ReactModule(name = CalculationModule.NAME)
class CalculationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = NAME

    @ReactMethod
    fun fibonacci(n: Double, promise: Promise) {
        try {
            val result = calculateFibonacci(n.toInt())
            promise.resolve(result.toDouble())
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to calculate fibonacci", e)
        }
    }

    @ReactMethod
    fun primeFactors(n: Double, promise: Promise) {
        try {
            val factors = calculatePrimeFactors(n.toInt())
            val array = WritableNativeArray()
            factors.forEach { array.pushDouble(it.toDouble()) }
            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to calculate prime factors", e)
        }
    }

    @ReactMethod
    fun matrixMultiplication(size: Double, promise: Promise) {
        try {
            val result = performMatrixMultiplication(size.toInt())
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to perform matrix multiplication", e)
        }
    }

    // Optimized: Using memoization for faster calculation
    private val fibCache = mutableMapOf<Int, Long>()
    
    private fun calculateFibonacci(n: Int): Long {
        if (n <= 1) return n.toLong()
        
        // Check cache first - TurboModule optimization
        fibCache[n]?.let { return it }
        
        var a = 0L
        var b = 1L
        
        for (i in 2..n) {
            val c = a + b
            a = b
            b = c
        }
        
        // Cache the result
        fibCache[n] = b
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
        // Seed random number generator with fixed value for consistent results
        val random = Random(42)
        
        val matrixA = Array(size) { DoubleArray(size) { random.nextDouble(0.0, 10.0) } }
        val matrixB = Array(size) { DoubleArray(size) { random.nextDouble(0.0, 10.0) } }
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

    companion object {
        const val NAME = "CalculationModule"
    }
}
