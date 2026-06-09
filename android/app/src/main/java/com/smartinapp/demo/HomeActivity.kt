package com.smartinapp.demo

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import com.smartinapp.sdk.SmartInApp
import com.smartinapp.sdk.SmartInAppBannerView
import com.smartinapp.sdk.SmartInAppMessages

class HomeActivity : Activity() {

    private lateinit var bannerView: SmartInAppBannerView
    private lateinit var goShoppingButton: Button
    private lateinit var userTypeText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        bannerView = findViewById(R.id.smart_banner)
        goShoppingButton = findViewById(R.id.go_shopping_button)
        userTypeText = findViewById(R.id.user_type_text)

        val audience = intent.getStringExtra(MainActivity.EXTRA_USER_AUDIENCE)
            ?: MainActivity.AUDIENCE_BUYER
        userTypeText.text = "User Type: $audience"

        goShoppingButton.setOnClickListener {
            startActivity(Intent(this, BooksActivity::class.java))
        }

        SmartInApp.setNavigationHandler { target ->
            when (target) {
                "books_screen" -> {
                    startActivity(Intent(this, BooksActivity::class.java))
                }
            }
        }

        bannerView.load("home_screen")

        SmartInAppMessages.show(
            context = this@HomeActivity,
            placement = "home_screen"
        )
    }

//    override fun onResume() {
//        super.onResume()
//
//        activityScope.launch {
//            SmartInApp.refresh()
//            bannerView.load("home_screen")
//
//            SmartInAppMessages.show(
//                context = this@HomeActivity,
//                placement = "home_screen"
//            )
//        }
//    }

}
