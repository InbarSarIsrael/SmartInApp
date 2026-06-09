package com.smartinapp.sdk

import android.content.Context
import com.smartinapp.sdk.network.AnalyticsEventRequest
import com.smartinapp.sdk.network.MessageDto
import com.smartinapp.sdk.network.PortalLoginRequest
import com.smartinapp.sdk.network.ProjectDto
import com.smartinapp.sdk.network.RetrofitClient
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object SmartInApp {

    private const val PREFS_NAME = "smartinapp_prefs"
    private const val API_KEY = "api_key"

    private var apiKey: String? = null
    private var project: ProjectDto? = null

    private const val CACHE_PREFIX = "messages_cache_"

    private var appContext: Context? = null
    private val gson = Gson()

    private val shownMessageIds = mutableSetOf<Int>()

    private var navigationHandler: ((String) -> Unit)? = null

    private var userAudience: String = "ALL"

    // Updates the backend URL used by the SDK network client.
    fun setBaseUrl(url: String) {
        RetrofitClient.setBaseUrl(url)
    }

    // Initializes the SDK with app context and validates the project API key.
    suspend fun initialize(context: Context, apiKey: String): ProjectDto? {
        this.apiKey = apiKey
        this.appContext = context.applicationContext

        context
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(API_KEY, apiKey)
            .apply()

        val response = try {
            RetrofitClient.apiService.login(
                PortalLoginRequest(api_key = apiKey)
            )
        } catch (exception: Exception) {
            return null
        }

        if (response.isSuccessful) {
            project = response.body()?.project
            return project
        }

        return null
    }

    // Saves fetched messages locally so the SDK can fall back to cache.
    private fun cacheMessages(placement: String, messages: List<MessageDto>) {
        val context = appContext ?: return

        val json = gson.toJson(messages)

        context
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(CACHE_PREFIX + placement, json)
            .apply()
    }

    // Reads cached messages for a placement.
    private fun getCachedMessages(placement: String): List<MessageDto> {
        val context = appContext ?: return emptyList()

        val json = context
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(CACHE_PREFIX + placement, null)
            ?: return emptyList()

        return try {
            val type = object : TypeToken<List<MessageDto>>() {}.type
            gson.fromJson(json, type)
        } catch (exception: Exception) {
            emptyList()
        }
    }

    // Fetches active messages from the backend and falls back to cached data.
    suspend fun fetchMessages(placement: String): List<MessageDto> {
        val currentApiKey = apiKey ?: return getCachedMessages(placement)

        val response = try {
            RetrofitClient.apiService.getMessages(
                apiKey = currentApiKey,
                placement = placement
            )
        } catch (exception: Exception) {
            return getCachedMessages(placement)
        }

        if (response.isSuccessful) {
            val messages = response.body()?.messages ?: emptyList()
            cacheMessages(placement, messages)
            return messages
        }

        return getCachedMessages(placement)
    }

    // Returns dialog messages for the current placement and audience.
    suspend fun getDialogMessages(placement: String): List<MessageDto> {
        return fetchMessages(placement).filter { message ->
            message.type == "DIALOG" && isMessageForCurrentAudience(message)
        }
    }

    // Returns banner messages for the current placement and audience.
    suspend fun getBannerMessages(placement: String): List<MessageDto> {
        return fetchMessages(placement).filter { message ->
            message.type == "BANNER" && isMessageForCurrentAudience(message)
        }
    }

    // Reports that a message was shown to the user.
    suspend fun trackView(messageId: Int) {
        try {
            RetrofitClient.apiService.trackView(
                AnalyticsEventRequest(message_id = messageId)
            )
        } catch (exception: Exception) {
        }
    }

    // Reports that a message action button was clicked.
    suspend fun trackClick(messageId: Int) {
        try {
            RetrofitClient.apiService.trackClick(
                AnalyticsEventRequest(message_id = messageId)
            )
        } catch (exception: Exception) {
        }
    }

    // Reports that a message was closed or dismissed.
    suspend fun trackDismiss(messageId: Int) {
        try {
            RetrofitClient.apiService.trackDismiss(
                AnalyticsEventRequest(message_id = messageId)
            )
        } catch (exception: Exception) {
        }
    }

    // Checks if a message was already shown in this app session.
    fun wasMessageShown(messageId: Int): Boolean {
        return shownMessageIds.contains(messageId)
    }

    // Marks a message as already shown for this app session.
    fun markMessageAsShown(messageId: Int) {
        shownMessageIds.add(messageId)
    }

    // Registers app-specific navigation for SDK action targets.
    fun setNavigationHandler(handler: (String) -> Unit) {
        navigationHandler = handler
    }

    // Sends a message action target to the app navigation handler.
    fun handleNavigation(target: String?) {
        if (target.isNullOrBlank()) {
            return
        }

        navigationHandler?.invoke(target)
    }

    // Sets the current user audience used for message filtering.
    fun setUserAudience(audience: String) {
        userAudience = audience.trim().uppercase()
    }

    // Checks whether a message should be shown to the current audience.
    private fun isMessageForCurrentAudience(message: MessageDto): Boolean {
        val targetAudience = message.target_audience?.trim()

        return targetAudience.isNullOrBlank() ||
            targetAudience.equals("ALL", ignoreCase = true) ||
            targetAudience.equals(userAudience, ignoreCase = true)
    }

    // Returns the API key from memory or shared preferences.
    fun getApiKey(context: Context): String? {
        if (apiKey != null) {
            return apiKey
        }

        apiKey = context
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(API_KEY, null)

        return apiKey
    }

    // Returns the project data loaded during SDK initialization.
    fun getProject(): ProjectDto? {
        return project
    }

    // Reloads the project data and allows messages to be shown again.
    suspend fun refresh(): ProjectDto? {
        val currentApiKey = apiKey ?: return null

        val response = try {
            RetrofitClient.apiService.login(
                PortalLoginRequest(api_key = currentApiKey)
            )
        } catch (exception: Exception) {
            return null
        }

        if (response.isSuccessful) {
            project = response.body()?.project
            shownMessageIds.clear()
            return project
        }

        return null
    }
}
