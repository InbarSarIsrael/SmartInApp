package com.smartinapp.sdk

import android.app.AlertDialog
import android.content.Context
import com.smartinapp.sdk.network.MessageDto
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

object SmartInAppMessages {

    // Loads and shows dialog messages for a placement.
    fun show(context: Context, placement: String) {
        val scope = MainScope()

        scope.launch {
            val messages = SmartInApp.getDialogMessages(placement)
            showMessage(context, messages, 0, scope)
        }
    }

    // Shows one dialog message and continues to the next when needed.
    private fun showMessage(
        context: Context,
        messages: List<MessageDto>,
        index: Int,
        scope: CoroutineScope
    ) {
        val message = messages.getOrNull(index) ?: return

        if (SmartInApp.wasMessageShown(message.message_id)) {
            showMessage(context, messages, index + 1, scope)
            return
        }

        SmartInApp.markMessageAsShown(message.message_id)

        scope.launch {
            SmartInApp.trackView(message.message_id)
        }

        AlertDialog.Builder(context)
            .setTitle(message.title)
            .setMessage(message.content)
            .setPositiveButton(message.button_text ?: "OK") { _, _ ->
                scope.launch {
                    SmartInApp.trackClick(message.message_id)
                }

                if (!message.action_target.isNullOrBlank()) {
                    SmartInApp.handleNavigation(message.action_target)
                    return@setPositiveButton
                }
                showMessage(context, messages, index + 1, scope)
            }
            .setNegativeButton("Close") { _, _ ->
                scope.launch {
                    SmartInApp.trackDismiss(message.message_id)
                }
                showMessage(context, messages, index + 1, scope)
            }
            .setOnCancelListener {
                scope.launch {
                    SmartInApp.trackDismiss(message.message_id)
                }
                showMessage(context, messages, index + 1, scope)
            }
            .show()
    }
}
