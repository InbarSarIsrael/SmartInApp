package com.smartinapp.demo

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import com.smartinapp.sdk.SmartInApp
import com.smartinapp.sdk.SmartInAppMessages
import com.smartinapp.sdk.SmartInAppBannerView
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.cancel

class BooksActivity : Activity() {

    private val activityScope = MainScope()
    private lateinit var bannerView: SmartInAppBannerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_books)

        val homeButton = findViewById<Button>(R.id.home_button)

        homeButton.setOnClickListener {
            startActivity(Intent(this, HomeActivity::class.java))
            finish()
        }


        SmartInApp.setNavigationHandler { target ->
            when (target) {
                "home_screen" -> {
                    startActivity(Intent(this, HomeActivity::class.java))
                    finish()
                }
            }
        }

        bannerView = findViewById(R.id.smart_banner)

        // Banner
        bannerView.load("books_screen")

        // Dialog
        SmartInAppMessages.show(
            context = this@BooksActivity,
            placement = "books_screen"
        )
    }

//    override fun onResume() {
//        super.onResume()
//
//        activityScope.launch {
//            SmartInApp.refresh()
//            bannerView.load("books_screen")
//
//        }
//    }

    override fun onDestroy() {
        super.onDestroy()
        activityScope.cancel()
    }
}
