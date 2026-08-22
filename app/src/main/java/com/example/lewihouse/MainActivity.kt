package com.example.lewihouse

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.lewihouse.data.local.LewiHouseDatabase
import com.example.lewihouse.data.repository.LewiHouseRepository
import com.example.lewihouse.ui.screens.MainContainerScreen
import com.example.lewihouse.ui.theme.LewiHouseTheme
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModel
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: LewiHouseViewModel by viewModels {
        val db = LewiHouseDatabase.getDatabase(applicationContext)
        val repository = LewiHouseRepository(
            residentDao = db.residentDao(),
            transactionDao = db.transactionDao(),
            unitDao = db.unitOccupancyDao(),
            maintenanceDao = db.maintenanceDao(),
            tokenDao = db.tokenDao(),
            leadDao = db.potentialTenantDao()
        )
        LewiHouseViewModelFactory(repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val isDarkMode by viewModel.isDarkMode.collectAsStateWithLifecycle()
            val systemDark = isSystemInDarkTheme()

            LewiHouseTheme(darkTheme = isDarkMode) {
                MainContainerScreen(viewModel = viewModel)
            }
        }
    }
}
