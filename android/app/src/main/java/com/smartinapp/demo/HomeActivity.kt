package com.smartinapp.demo

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import com.smartinapp.sdk.SmartInApp
import com.smartinapp.sdk.SmartInAppBannerView
import com.smartinapp.sdk.SmartInAppDialogs

class HomeActivity : Activity() {

    private lateinit var bannerView: SmartInAppBannerView
    private lateinit var goShoppingButton: Button
    private lateinit var userTypeText: TextView
    private lateinit var currentAudience: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        bannerView = findViewById(R.id.smart_banner)
        goShoppingButton = findViewById(R.id.go_shopping_button)
        userTypeText = findViewById(R.id.user_type_text)

        currentAudience = intent.getStringExtra(MainActivity.EXTRA_USER_AUDIENCE)
            ?: MainActivity.AUDIENCE_BUYER
        SmartInApp.setUserAudience(currentAudience)
        userTypeText.text = "User Type: $currentAudience"

        goShoppingButton.setOnClickListener {
            openBooks()
        }

        SmartInApp.setNavigationHandler { target ->
            when (target) {
                "books_screen" -> {
                    openBooks()
                }
            }
        }

        bannerView.load("home_screen")

        SmartInAppDialogs.load(
            context = this@HomeActivity,
            placement = "home_screen"
        )
    }

    private fun openBooks() {
        val intent = Intent(this, BooksActivity::class.java)
        intent.putExtra(MainActivity.EXTRA_USER_AUDIENCE, currentAudience)
        startActivity(intent)
    }

//    override fun onResume() {
//        super.onResume()
//
//        activityScope.launch {
//            SmartInApp.refresh()
//            bannerView.load("home_screen")
//
//            SmartInAppDialogs.load(
//                context = this@HomeActivity,
//                placement = "home_screen"
//            )
//        }
//    }

}
