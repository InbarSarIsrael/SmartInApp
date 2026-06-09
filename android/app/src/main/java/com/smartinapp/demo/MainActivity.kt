package com.smartinapp.demo

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import com.smartinapp.sdk.SmartInApp
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

class MainActivity : Activity() {

    private val activityScope = MainScope()

    companion object {
        const val EXTRA_USER_AUDIENCE = "USER_AUDIENCE"
        const val AUDIENCE_BUYER = "BUYER"
        const val AUDIENCE_SELLER = "SELLER"
        const val AUDIENCE_MANAGER = "MANAGER"
        private const val SMART_IN_APP_BASE_URL = "http://192.168.1.241:8000/"
        private const val SMART_IN_APP_API_KEY = "pk_test_bookstore_123"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        SmartInApp.setBaseUrl(SMART_IN_APP_BASE_URL)

        activityScope.launch {
            SmartInApp.initialize(
                context = this@MainActivity,
                apiKey = SMART_IN_APP_API_KEY
            )
        }

        val buyerButton = findViewById<Button>(R.id.buyer_button)
        val sellerButton = findViewById<Button>(R.id.seller_button)
        val managerButton = findViewById<Button>(R.id.manager_button)

        buyerButton.setOnClickListener {
            openHomeWithAudience(AUDIENCE_BUYER)
        }

        sellerButton.setOnClickListener {
            openHomeWithAudience(AUDIENCE_SELLER)
        }

        managerButton.setOnClickListener {
            openHomeWithAudience(AUDIENCE_MANAGER)
        }
    }

    private fun openHomeWithAudience(audience: String) {
        SmartInApp.setUserAudience(audience)

        val intent = Intent(this, HomeActivity::class.java)
        intent.putExtra(EXTRA_USER_AUDIENCE, audience)
        startActivity(intent)
    }

    override fun onDestroy() {
        super.onDestroy()
        activityScope.cancel()
    }
}
