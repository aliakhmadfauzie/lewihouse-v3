package com.example.lewihouse.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.lewihouse.data.model.BottomNavTab
import com.example.lewihouse.ui.components.AppBottomNav
import com.example.lewihouse.ui.components.AppTopBar
import com.example.lewihouse.ui.components.NotificationDrawer
import com.example.lewihouse.ui.components.ToastBannerContainer
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainContainerScreen(
    viewModel: LewiHouseViewModel
) {
    val isAuthenticated by viewModel.isAuthenticated.collectAsStateWithLifecycle()
    val userRole by viewModel.userRole.collectAsStateWithLifecycle()
    val currentTab by viewModel.currentTab.collectAsStateWithLifecycle()
    val language by viewModel.language.collectAsStateWithLifecycle()
    val isDarkMode by viewModel.isDarkMode.collectAsStateWithLifecycle()
    val isNotifOpen by viewModel.isNotificationDrawerOpen.collectAsStateWithLifecycle()
    val toasts by viewModel.toasts.collectAsStateWithLifecycle()
    val notifications by viewModel.notificationHistory.collectAsStateWithLifecycle()
    val strings = viewModel.strings

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    if (!isAuthenticated) {
        LoginScreen(viewModel = viewModel)
    } else {
        Scaffold(
            topBar = {
                AppTopBar(
                    role = userRole,
                    language = language,
                    isDarkMode = isDarkMode,
                    unreadNotificationCount = notifications.size,
                    onToggleLanguage = { viewModel.toggleLanguage() },
                    onToggleDarkMode = { viewModel.toggleDarkMode() },
                    onOpenNotifications = { viewModel.setNotificationDrawerOpen(true) }
                )
            },
            bottomBar = {
                AppBottomNav(
                    role = userRole,
                    currentTab = currentTab,
                    strings = strings,
                    onTabSelected = { viewModel.setTab(it) }
                )
            },
            containerColor = MaterialTheme.colorScheme.background,
            modifier = Modifier.testTag("main_scaffold")
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                when (currentTab) {
                    BottomNavTab.DASHBOARD -> AdminDashboardScreen(viewModel = viewModel)
                    BottomNavTab.RESIDENTS -> ResidentsScreen(viewModel = viewModel)
                    BottomNavTab.PAYMENTS -> PaymentsScreen(viewModel = viewModel)
                    BottomNavTab.ROOMS -> RoomsScreen(viewModel = viewModel)
                    BottomNavTab.MAINTENANCE -> MaintenanceScreen(viewModel = viewModel)
                    BottomNavTab.LEADS -> LeadsScreen(viewModel = viewModel)
                    BottomNavTab.PROFILE -> UserProfileScreen(viewModel = viewModel)
                    BottomNavTab.HOME -> TenantDashboardScreen(viewModel = viewModel)
                    BottomNavTab.BILLS -> TenantBillsScreen(viewModel = viewModel)
                    BottomNavTab.UTILITIES -> TokensScreen(viewModel = viewModel)
                    BottomNavTab.DEV_HOME -> DeveloperScreen(viewModel = viewModel)
                }

                // In-App Toast Notifications
                ToastBannerContainer(
                    toasts = toasts,
                    onDismiss = { viewModel.removeToast(it) },
                    modifier = Modifier.align(Alignment.TopCenter)
                )
            }

            // Notification Drawer Modal Bottom Sheet
            NotificationDrawer(
                isOpen = isNotifOpen,
                notifications = notifications,
                sheetState = sheetState,
                onDismiss = { viewModel.setNotificationDrawerOpen(false) },
                onClearAll = { viewModel.clearAllNotifications() }
            )
        }
    }
}
