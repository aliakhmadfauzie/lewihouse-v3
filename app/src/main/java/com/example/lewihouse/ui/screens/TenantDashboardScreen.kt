package com.example.lewihouse.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.MeetingRoom
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.lewihouse.data.model.BottomNavTab
import com.example.lewihouse.ui.theme.AmberSecondary
import com.example.lewihouse.ui.theme.CoralError
import com.example.lewihouse.ui.theme.EmeraldTertiary
import com.example.lewihouse.ui.theme.IndigoDark
import com.example.lewihouse.ui.theme.IndigoPrimary
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModel
import com.example.lewihouse.utils.Formatters

@Composable
fun TenantDashboardScreen(
    viewModel: LewiHouseViewModel
) {
    val currentResident by viewModel.currentResident.collectAsStateWithLifecycle()
    val transactions by viewModel.transactions.collectAsStateWithLifecycle()
    val maintenanceRequests by viewModel.maintenanceRequests.collectAsStateWithLifecycle()
    val strings = viewModel.strings

    var showPayRentModal by remember { mutableStateOf(false) }
    var showReportModal by remember { mutableStateOf(false) }

    val tenantTransactions = transactions.filter { it.residentId == (currentResident?.id ?: "res_2") || it.unitId == "205" }
    val tenantTickets = maintenanceRequests.filter { it.unit.contains("205") || it.unit.contains("210") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
            .testTag("tenant_dashboard_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))

            // Welcome Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                listOf(
                                    EmeraldTertiary.copy(alpha = 0.12f),
                                    IndigoPrimary.copy(alpha = 0.08f)
                                )
                            )
                        )
                        .padding(18.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Selamat Datang,",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = currentResident?.name ?: "Siti Aminah",
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(IndigoPrimary.copy(alpha = 0.15f))
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = currentResident?.room ?: "Room 205",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = IndigoPrimary
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Rent status box
                        val isOverdue = (currentResident?.balance ?: 0L) > 0
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isOverdue) CoralError.copy(alpha = 0.12f) else EmeraldTertiary.copy(alpha = 0.12f)
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = if (isOverdue) "Tagihan Sewa Menunggak" else "Tagihan Sewa Lunas",
                                        fontWeight = FontWeight.Bold,
                                        color = if (isOverdue) CoralError else EmeraldTertiary,
                                        fontSize = 13.sp
                                    )
                                    Text(
                                        text = if (isOverdue) Formatters.formatRupiah(currentResident?.balance ?: 2500000L) else "Periode Oktober 2026",
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                }

                                if (isOverdue) {
                                    Button(
                                        onClick = { showPayRentModal = true },
                                        shape = RoundedCornerShape(8.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = CoralError),
                                        modifier = Modifier.height(34.dp)
                                    ) {
                                        Text("Bayar Sekarang", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                } else {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = null,
                                        tint = EmeraldTertiary,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Quick Actions Grid (Pay Rent, Utilities Token, Maintenance Report, Emergency)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                TenantActionCard(
                    title = "Token Listrik",
                    subtitle = "Beli token PLN instan",
                    icon = Icons.Default.Bolt,
                    color = AmberSecondary,
                    onClick = { viewModel.setTab(BottomNavTab.UTILITIES) },
                    modifier = Modifier.weight(1f)
                )

                TenantActionCard(
                    title = "Lapor Masalah",
                    subtitle = "AC, air, kunci, dll",
                    icon = Icons.Default.Build,
                    color = IndigoPrimary,
                    onClick = { showReportModal = true },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Active maintenance for tenant room
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Laporan Pemeliharaan Anda",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                TextButton(onClick = { viewModel.setTab(BottomNavTab.MAINTENANCE) }) {
                    Text(text = "Semua", fontSize = 12.sp, color = IndigoPrimary)
                }
            }

            if (tenantTickets.isEmpty()) {
                Text(
                    text = "Semua fasilitas kamar dalam kondisi prima",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    tenantTickets.forEach { req ->
                        MaintenanceTicketCard(
                            req = req,
                            onStatusChange = { newStatus ->
                                viewModel.updateMaintenanceStatus(req.id, newStatus)
                            }
                        )
                    }
                }
            }
        }

        // Emergency Contacts
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp)
                ) {
                    Text(
                        text = "Kontak Pengelola & Keamanan 24 Jam",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleSmall,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Security Central: +62 811-0000-9988\nPengelola Kost: +62 812-8899-0011 (Ali Akhmad)",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(72.dp))
        }
    }

    if (showPayRentModal) {
        PayRentDialog(
            balance = currentResident?.balance ?: 2500000L,
            onDismiss = { showPayRentModal = false },
            onConfirmPayment = {
                val res = currentResident
                if (res != null) {
                    viewModel.updateResident(res.copy(status = "Paid", balance = 0L))
                    viewModel.addTransaction(
                        title = "Rent Payment - ${res.room}",
                        amount = res.balance.coerceAtLeast(2500000L),
                        isIncome = true,
                        unitId = "205",
                        residentId = res.id
                    )
                }
                showPayRentModal = false
            }
        )
    }

    if (showReportModal) {
        NewMaintenanceDialog(
            onDismiss = { showReportModal = false },
            onConfirm = { unit, issue, desc, priority, isEmergency ->
                viewModel.addMaintenanceRequest(unit, issue, desc, priority, isEmergency)
                showReportModal = false
            }
        )
    }
}

@Composable
fun TenantActionCard(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        onClick = onClick
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 11.sp
            )
        }
    }
}

@Composable
fun PayRentDialog(
    balance: Long,
    onDismiss: () -> Unit,
    onConfirmPayment: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Pembayaran Sewa Kamar", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "Total Tagihan: ${Formatters.formatRupiah(balance)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = CoralError
                )

                Text(
                    text = "Silakan transfer ke rekening Virtual Account resmi Lewi House:",
                    fontSize = 12.sp
                )

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Bank BCA Virtual Account", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        Text("8808 2050 9948 1002", fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = IndigoPrimary)
                        Text("a/n Lewi House - Room 205", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = onConfirmPayment,
                colors = ButtonDefaults.buttonColors(containerColor = EmeraldTertiary)
            ) {
                Text("Konfirmasi Pembayaran")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Tutup") }
        }
    )
}
