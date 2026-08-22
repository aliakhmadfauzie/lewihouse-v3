package com.example.lewihouse.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.lewihouse.ui.theme.EmeraldTertiary
import com.example.lewihouse.ui.theme.IndigoPrimary
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModel

@Composable
fun MaintenanceScreen(
    viewModel: LewiHouseViewModel
) {
    val requests by viewModel.maintenanceRequests.collectAsStateWithLifecycle()
    val strings = viewModel.strings

    var filterStatus by remember { mutableStateOf("All") }
    var showNewModal by remember { mutableStateOf(false) }

    val filteredRequests = requests.filter { req ->
        when (filterStatus) {
            "Pending" -> req.status.equals("Pending", ignoreCase = true)
            "In Progress" -> req.status.equals("In Progress", ignoreCase = true)
            "Resolved" -> req.status.equals("Resolved", ignoreCase = true)
            else -> true
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showNewModal = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier.testTag("fab_new_maintenance")
            ) {
                Icon(Icons.Default.Add, contentDescription = "New Maintenance")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .testTag("maintenance_screen")
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            // Action toolbar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                OutlinedButton(
                    onClick = { viewModel.simulateTechnicianUpdate() },
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("btn_simulate_technician")
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = null,
                        tint = IndigoPrimary
                    )
                    Spacer(modifier = Modifier.padding(horizontal = 4.dp))
                    Text(
                        text = "Simulasi Update Teknisi Live",
                        fontWeight = FontWeight.Bold,
                        color = IndigoPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Filter Tabs
            val filters = listOf(
                Pair("All", "Semua (${requests.size})"),
                Pair("Pending", "Menunggu (${requests.count { it.status.equals("Pending", true) }})"),
                Pair("In Progress", "Sedang Dikerjakan (${requests.count { it.status.equals("In Progress", true) }})"),
                Pair("Resolved", "Selesai (${requests.count { it.status.equals("Resolved", true) }})")
            )

            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(filters) { (key, label) ->
                    val isSelected = filterStatus == key
                    Button(
                        onClick = { filterStatus = key },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isSelected) IndigoPrimary else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                        ),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        modifier = Modifier.height(34.dp)
                    ) {
                        Text(text = label, fontSize = 11.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredRequests, key = { it.id }) { req ->
                    MaintenanceTicketCard(
                        req = req,
                        onStatusChange = { newStatus ->
                            viewModel.updateMaintenanceStatus(req.id, newStatus)
                        }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(72.dp))
                }
            }
        }
    }

    if (showNewModal) {
        NewMaintenanceDialog(
            onDismiss = { showNewModal = false },
            onConfirm = { unit, issue, desc, priority, isEmergency ->
                viewModel.addMaintenanceRequest(unit, issue, desc, priority, isEmergency)
                showNewModal = false
            }
        )
    }
}
