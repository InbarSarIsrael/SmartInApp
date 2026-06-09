package com.smartinapp.sdk.network

data class MessagesResponse(
    val project_name: String,
    val messages: List<MessageDto>
)

data class MessageDto(
    val message_id: Int,
    val title: String,
    val content: String,
    val type: String,
    val placement: String,
    val button_text: String?,
    val action_target: String?,
    val target_audience: String?
)