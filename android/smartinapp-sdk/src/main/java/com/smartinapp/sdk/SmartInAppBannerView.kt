package com.smartinapp.sdk

import android.content.Context
import android.util.AttributeSet
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.TextView
import com.smartinapp.sdk.network.MessageDto
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

class SmartInAppBannerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private val viewScope = MainScope()
    private val titleText: TextView
    private val contentText: TextView
    private val closeButton: ImageButton
    private val actionButton: Button

    private var messages: List<MessageDto> = emptyList()
    private var currentIndex = 0

    init {
        LayoutInflater.from(context).inflate(R.layout.view_smart_in_app_banner, this, true)
        titleText = findViewById(R.id.smart_banner_title)
        contentText = findViewById(R.id.smart_banner_content)
        closeButton = findViewById(R.id.smart_banner_close)
        actionButton = findViewById(R.id.smart_banner_action)
        visibility = View.GONE
    }

    // Loads banner messages for a placement and displays the first available one.
    fun load(placement: String) {
        viewScope.launch {
            messages = SmartInApp.getBannerMessages(placement)
            currentIndex = 0
            showCurrentMessage()
        }
    }

    // Cancels banner work when the view leaves the screen.
    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        viewScope.cancel()
    }

    // Displays the current banner message and wires its actions.
    private fun showCurrentMessage() {
        val message = messages.getOrNull(currentIndex)

        if (message != null && SmartInApp.wasMessageShown(message.message_id)) {
            moveToNextMessage()
            return
        }

        if (message == null) {
            visibility = View.GONE
            return
        }

        visibility = View.VISIBLE
        titleText.text = message.title
        contentText.text = message.content
        actionButton.text = message.button_text ?: "OK"
        actionButton.visibility = if (message.button_text == null) View.GONE else View.VISIBLE

        SmartInApp.markMessageAsShown(message.message_id)

        viewScope.launch {
            SmartInApp.trackView(message.message_id)
        }

        closeButton.setOnClickListener {
            viewScope.launch {
                SmartInApp.trackDismiss(message.message_id)
            }
            moveToNextMessage()
        }

        actionButton.setOnClickListener {
            viewScope.launch {
                SmartInApp.trackClick(message.message_id)
            }

            if (!message.action_target.isNullOrBlank()) {
                SmartInApp.handleNavigation(message.action_target)
                visibility = View.GONE
                return@setOnClickListener
            }

            moveToNextMessage()
        }
    }

    // Advances to the next banner message.
    private fun moveToNextMessage() {
        currentIndex++
        showCurrentMessage()
    }
}
