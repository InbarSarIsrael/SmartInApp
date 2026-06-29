package com.smartinapp.demo

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import com.smartinapp.sdk.SmartInApp
import com.smartinapp.sdk.SmartInAppDialogs
import com.smartinapp.sdk.SmartInAppBannerView
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.cancel

class BooksActivity : Activity() {

    private val activityScope = MainScope()
    private lateinit var bannerView: SmartInAppBannerView
    private lateinit var currentAudience: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_books)

        val homeButton = findViewById<Button>(R.id.home_button)

        currentAudience = intent.getStringExtra(MainActivity.EXTRA_USER_AUDIENCE)
            ?: MainActivity.AUDIENCE_BUYER
        SmartInApp.setUserAudience(currentAudience)

        homeButton.setOnClickListener {
            openHome()
        }


        SmartInApp.setNavigationHandler { target ->
            when (target) {
                "home_screen" -> {
                    openHome()
                }
            }
        }

        bannerView = findViewById(R.id.smart_banner)

        // Banner
        bannerView.load("books_screen")

        // Dialog
        SmartInAppDialogs.load(
            context = this@BooksActivity,
            placement = "books_screen"
        )
    }

    private fun openHome() {
        val intent = Intent(this, HomeActivity::class.java)
        intent.putExtra(MainActivity.EXTRA_USER_AUDIENCE, currentAudience)
        startActivity(intent)
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        activityScope.cancel()
    }
}
