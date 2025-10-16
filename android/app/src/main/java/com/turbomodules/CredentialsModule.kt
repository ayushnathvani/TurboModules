package com.turbomodules

import android.content.Context
import android.content.SharedPreferences
import android.util.Base64
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

/**
 * ✨ PERSISTENT CREDENTIALS TURBOMODULE IMPLEMENTATION
 * 
 * Features:
 * 1. Uses Android SharedPreferences with Base64 encoding for password storage (never removed)
 * 2. Regular SharedPreferences for username suggestions with timestamps
 * 3. Facebook-like credential suggestions and quick login
 * 4. Optimized for performance with minimal allocations
 */

@ReactModule(name = CredentialsModule.NAME)
class CredentialsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val credentialsPrefs: SharedPreferences by lazy {
        reactApplicationContext.getSharedPreferences("secure_credentials", Context.MODE_PRIVATE)
    }
    
    private val suggestionsPrefs: SharedPreferences by lazy {
        reactApplicationContext.getSharedPreferences("username_suggestions", Context.MODE_PRIVATE)
    }

    override fun getName() = NAME

    private fun encodePassword(password: String): String {
        return Base64.encodeToString(password.toByteArray(), Base64.DEFAULT)
    }

    private fun decodePassword(encodedPassword: String): String {
        return String(Base64.decode(encodedPassword, Base64.DEFAULT))
    }

    @ReactMethod
    fun saveCredentials(username: String, password: String, promise: Promise) {
        try {
            if (username.isEmpty() || password.isEmpty()) {
                promise.reject("INVALID_PARAMS", "Username and password cannot be empty")
                return
            }

            // Save password with simple encoding (never removed)
            val encodedPassword = encodePassword(password)
            credentialsPrefs.edit().putString(username, encodedPassword).apply()
            
            // Update username suggestions with timestamp
            val currentTime = System.currentTimeMillis()
            suggestionsPrefs.edit().putLong(username, currentTime).apply()
            
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to save credentials", e)
        }
    }

    @ReactMethod
    fun getPassword(username: String, promise: Promise) {
        try {
            if (username.isEmpty()) {
                promise.resolve(null)
                return
            }
            
            val encodedPassword = credentialsPrefs.getString(username, null)
            if (encodedPassword != null) {
                val password = decodePassword(encodedPassword)
                promise.resolve(password)
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get password", e)
        }
    }

    @ReactMethod
    fun getUsernameSuggestions(promise: Promise) {
        try {
            val suggestions = suggestionsPrefs.all
            val result = WritableNativeArray()
            
            // Sort by timestamp (most recent first)
            val sortedSuggestions = suggestions.toList().sortedByDescending { it.second as Long }
            
            for ((username, timestamp) in sortedSuggestions) {
                val suggestion = WritableNativeMap()
                suggestion.putString("username", username)
                suggestion.putDouble("lastUsed", (timestamp as Long).toDouble())
                result.pushMap(suggestion)
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get username suggestions", e)
        }
    }

    @ReactMethod
    fun getAllStoredCredentials(promise: Promise) {
        try {
            val allCredentials = credentialsPrefs.all
            val result = WritableNativeArray()
            
            for ((username, encodedPassword) in allCredentials) {
                if (encodedPassword is String) {
                    try {
                        val password = decodePassword(encodedPassword)
                        val credential = WritableNativeMap()
                        credential.putString("username", username)
                        credential.putString("password", password)
                        credential.putDouble("timestamp", System.currentTimeMillis().toDouble())
                        result.pushMap(credential)
                    } catch (e: Exception) {
                        // Skip invalid encoded passwords
                        continue
                    }
                }
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get all stored credentials", e)
        }
    }

    @ReactMethod
    fun hasCredentials(username: String, promise: Promise) {
        try {
            if (username.isEmpty()) {
                promise.resolve(false)
                return
            }
            
            val hasPassword = credentialsPrefs.contains(username)
            promise.resolve(hasPassword)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check credentials", e)
        }
    }

    @ReactMethod
    fun updateLastUsed(username: String, promise: Promise) {
        try {
            if (username.isEmpty()) {
                promise.resolve(false)
                return
            }
            
            // Update timestamp for this username
            val currentTime = System.currentTimeMillis()
            suggestionsPrefs.edit().putLong(username, currentTime).apply()
            
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to update last used", e)
        }
    }

    companion object {
        const val NAME = "CredentialsModule"
    }
}