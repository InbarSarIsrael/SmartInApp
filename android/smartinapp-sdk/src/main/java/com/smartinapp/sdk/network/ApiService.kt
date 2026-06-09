package com.smartinapp.sdk.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {

    // Validates an API key and returns project data.
    @POST("portal/login")
    suspend fun login(
        @Body request: PortalLoginRequest
    ): Response<PortalLoginResponse>

    // Fetches active in-app messages for an API key and placement.
    @GET("sdk/messages")
    suspend fun getMessages(
        @Query("api_key") apiKey: String,
        @Query("placement") placement: String
    ): Response<MessagesResponse>

    // Sends a view analytics event.
    @POST("analytics/view")
    suspend fun trackView(
        @Body request: AnalyticsEventRequest
    ): Response<AnalyticsResponse>

    // Sends a click analytics event.
    @POST("analytics/click")
    suspend fun trackClick(
        @Body request: AnalyticsEventRequest
    ): Response<AnalyticsResponse>

    // Sends a dismiss analytics event.
    @POST("analytics/dismiss")
    suspend fun trackDismiss(
        @Body request: AnalyticsEventRequest
    ): Response<AnalyticsResponse>
}
