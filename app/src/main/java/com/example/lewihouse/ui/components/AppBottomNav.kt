package com.example.lewihouse.ui.components

import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ReceiptLong
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MeetingRoom
import androidx.compose.material.icons.filled.PeopleAlt
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PersonAddAlt
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.lewihouse.data.model.BottomNavTab
import com.example.lewihouse.data.model.UserRole
import com.example.lewihouse.utils.StringsDict

data class NavItem(
    val tab: BottomNavTab,
    val label: String,
    val icon: ImageVector
)

@Composable
fun AppBottomNav(
    role: UserRole,
    currentTab: BottomNavTab,
    strings: StringsDict,
    onTabSelected: (BottomNavTab) -> Unit
) {
    val items = when (role) {
        UserRole.ADMIN -> listOf(
            NavItem(BottomNavTab.DASHBOARD, strings.dashboard, Icons.Default.Dashboard),
            NavItem(BottomNavTab.RESIDENTS, strings.residents, Icons.Default.PeopleAlt),
            NavItem(BottomNavTab.PAYMENTS, strings.payments, Icons.Default.AccountBalanceWallet),
            NavItem(BottomNavTab.ROOMS, strings.rooms, Icons.Default.MeetingRoom),
            NavItem(BottomNavTab.MAINTENANCE, strings.maintenance, Icons.Default.Build),
            NavItem(BottomNavTab.LEADS, strings.leads, Icons.Default.PersonAddAlt),
            NavItem(BottomNavTab.PROFILE, strings.profile, Icons.Default.Person)
        )
        UserRole.TENANT -> listOf(
            NavItem(BottomNavTab.HOME, strings.dashboard, Icons.Default.Home),
            NavItem(BottomNavTab.BILLS, if (strings.appTitle == "Lewi House") "Tagihan" else "Bills", Icons.AutoMirrored.Filled.ReceiptLong),
            NavItem(BottomNavTab.UTILITIES, "Token", Icons.Default.Bolt),
            NavItem(BottomNavTab.MAINTENANCE, strings.maintenance, Icons.Default.Build),
            NavItem(BottomNavTab.PROFILE, strings.profile, Icons.Default.Person)
        )
        UserRole.DEVELOPER -> listOf(
            NavItem(BottomNavTab.DEV_HOME, "Console", Icons.Default.Code),
            NavItem(BottomNavTab.DASHBOARD, "Admin", Icons.Default.Dashboard),
            NavItem(BottomNavTab.MAINTENANCE, "Tickets", Icons.Default.Build),
            NavItem(BottomNavTab.PROFILE, strings.profile, Icons.Default.Person)
        )
    }

    NavigationBar(
        modifier = Modifier
            .windowInsetsPadding(WindowInsets.navigationBars)
            .testTag("app_bottom_navigation"),
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 6.dp
    ) {
        items.forEach { item ->
            val isSelected = currentTab == item.tab
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(item.tab) },
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label,
                        modifier = Modifier.size(20.dp)
                    )
                },
                label = {
                    Text(
                        text = item.label,
                        fontSize = 10.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        maxLines = 1
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                modifier = Modifier.testTag("nav_${item.tab.name.lowercase()}")
            )
        }
    }
}
