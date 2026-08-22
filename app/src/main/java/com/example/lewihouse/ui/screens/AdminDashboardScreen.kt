package com.example.lewihouse.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.MeetingRoom
import androidx.compose.material.icons.filled.PeopleAlt
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.lewihouse.data.model.BottomNavTab
import com.example.lewihouse.data.model.MaintenanceRequest
import com.example.lewihouse.data.model.PotentialTenant
import com.example.lewihouse.data.model.Transaction
import com.example.lewihouse.ui.theme.AmberSecondary
import com.example.lewihouse.ui.theme.CoralError
import com.example.lewihouse.ui.theme.EmeraldTertiary
import com.example.lewihouse.ui.theme.IndigoPrimary
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModel
import com.example.lewihouse.utils.Formatters

@Composable
fun AdminDashboardScreen(
    viewModel: LewiHouseViewModel
) {
    val metrics by viewModel.metrics.collectAsStateWithLifecycle()
    val transactions by viewModel.transactions.collectAsStateWithLifecycle()
    val maintenanceRequests by viewModel.maintenanceRequests.collectAsStateWithLifecycle()
    val leads by viewModel.potentialTenants.collectAsStateWithLifecycle()
    val strings = viewModel.strings

    var showAddResidentModal by remember { mutableStateOf(false) }
    var showRecordPaymentModal by remember { mutableStateOf(false) }
    var showNewMaintenanceModal by remember { mutableStateOf(false) }
    var showAddLeadModal by remember { mutableStateOf(false) }
    var showBuyTokenModal by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
            .testTag("admin_dashboard_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))

            // Greeting Hero Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    IndigoPrimary.copy(alpha = 0.08f),
                                    AmberSecondary.copy(alpha = 0.05f)
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
                                    text = "Estate Overview",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    text = "Lewi House Executive",
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(EmeraldTertiary.copy(alpha = 0.15f))
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(EmeraldTertiary)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "${metrics.occupancyRate}% Occupied",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = EmeraldTertiary
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Occupancy Progress Bar
                        LinearProgressIndicator(
                            progress = { (metrics.occupancyRate / 100f).coerceIn(0f, 1f) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = IndigoPrimary,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "${metrics.occupiedUnitsCount} ${strings.occupiedRooms}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "${metrics.totalUnitsCount - metrics.occupiedUnitsCount} ${strings.vacantRooms} (${metrics.totalUnitsCount} Total)",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }

        // Financial Metrics 2x2 Grid
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(
                        title = strings.totalRevenue,
                        value = Formatters.formatRupiah(metrics.totalRevenue),
                        subtitle = "Bulan Berjalan",
                        icon = Icons.Default.TrendingUp,
                        accentColor = EmeraldTertiary,
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = strings.netProfit,
                        value = Formatters.formatRupiah(metrics.netProfit),
                        subtitle = "Setelah Beban",
                        icon = Icons.Default.AccountBalanceWallet,
                        accentColor = IndigoPrimary,
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(
                        title = strings.overdueBalance,
                        value = Formatters.formatRupiah(metrics.outstandingBalance),
                        subtitle = "1 Penghuni",
                        icon = Icons.Default.Warning,
                        accentColor = CoralError,
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = strings.totalExpenses,
                        value = Formatters.formatRupiah(metrics.totalExpenses),
                        subtitle = "Pemeliharaan & Ops",
                        icon = Icons.Default.ArrowDownward,
                        accentColor = AmberSecondary,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Quick Actions Row
        item {
            Text(
                text = strings.quickActions,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(8.dp))

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                item {
                    QuickActionButton(
                        title = "+ Penghuni",
                        icon = Icons.Default.PersonAdd,
                        color = IndigoPrimary,
                        onClick = { showAddResidentModal = true },
                        testTag = "quick_add_resident"
                    )
                }
                item {
                    QuickActionButton(
                        title = "+ Transaksi",
                        icon = Icons.Default.AccountBalanceWallet,
                        color = EmeraldTertiary,
                        onClick = { showRecordPaymentModal = true },
                        testTag = "quick_record_payment"
                    )
                }
                item {
                    QuickActionButton(
                        title = "+ Laporan",
                        icon = Icons.Default.Build,
                        color = AmberSecondary,
                        onClick = { showNewMaintenanceModal = true },
                        testTag = "quick_new_maintenance"
                    )
                }
                item {
                    QuickActionButton(
                        title = "+ Prospek",
                        icon = Icons.Default.PeopleAlt,
                        color = Color(0xFF8B5CF6),
                        onClick = { showAddLeadModal = true },
                        testTag = "quick_add_lead"
                    )
                }
                item {
                    QuickActionButton(
                        title = "+ Token PLN",
                        icon = Icons.Default.Bolt,
                        color = AmberSecondary,
                        onClick = { showBuyTokenModal = true },
                        testTag = "quick_buy_token"
                    )
                }
                item {
                    QuickActionButton(
                        title = "Simulasi Update",
                        icon = Icons.Default.Refresh,
                        color = EmeraldTertiary,
                        onClick = { viewModel.simulateTechnicianUpdate() },
                        testTag = "quick_simulate_update"
                    )
                }
            }
        }

        // Incoming Leads Widget
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${strings.leads} (${leads.size})",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                TextButton(onClick = { viewModel.setTab(BottomNavTab.LEADS) }) {
                    Text(text = strings.viewAll, fontSize = 12.sp, color = IndigoPrimary)
                }
            }

            if (leads.isEmpty()) {
                Text(
                    text = "Belum ada data calon penghuni",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    leads.take(2).forEach { lead ->
                        LeadCardItem(
                            lead = lead,
                            onConvert = { viewModel.convertLeadToResident(lead.id) }
                        )
                    }
                }
            }
        }

        // Active Maintenance Tickets
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = strings.pendingMaintenance,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                TextButton(onClick = { viewModel.setTab(BottomNavTab.MAINTENANCE) }) {
                    Text(text = strings.viewAll, fontSize = 12.sp, color = IndigoPrimary)
                }
            }

            if (maintenanceRequests.isEmpty()) {
                Text(
                    text = "Tidak ada laporan pemeliharaan aktif",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    maintenanceRequests.take(2).forEach { req ->
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

        // Recent Transactions
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = strings.recentTransactions,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                TextButton(onClick = { viewModel.setTab(BottomNavTab.PAYMENTS) }) {
                    Text(text = strings.viewAll, fontSize = 12.sp, color = IndigoPrimary)
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                transactions.take(4).forEach { tx ->
                    TransactionItemCard(tx = tx)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    // Add Resident Dialog
    if (showAddResidentModal) {
        AddResidentDialog(
            onDismiss = { showAddResidentModal = false },
            onConfirm = { name, email, room, phone, contactName, contactPhone, occupation ->
                viewModel.addResident(
                    name = name,
                    email = email,
                    room = room,
                    phone = phone,
                    emergencyContactName = contactName,
                    emergencyContactPhone = contactPhone,
                    occupation = occupation
                )
                showAddResidentModal = false
            }
        )
    }

    // Record Payment Dialog
    if (showRecordPaymentModal) {
        RecordPaymentDialog(
            onDismiss = { showRecordPaymentModal = false },
            onConfirm = { title, amount, isIncome, unitId ->
                viewModel.addTransaction(title, amount, isIncome, unitId, "")
                showRecordPaymentModal = false
            }
        )
    }

    // New Maintenance Dialog
    if (showNewMaintenanceModal) {
        NewMaintenanceDialog(
            onDismiss = { showNewMaintenanceModal = false },
            onConfirm = { unit, issue, desc, priority, isEmergency ->
                viewModel.addMaintenanceRequest(unit, issue, desc, priority, isEmergency)
                showNewMaintenanceModal = false
            }
        )
    }

    // Add Lead Dialog
    if (showAddLeadModal) {
        AddLeadDialog(
            onDismiss = { showAddLeadModal = false },
            onConfirm = { name, phone, source, targetUnit, budget, notes ->
                viewModel.addPotentialTenant(
                    name = name,
                    phone = phone,
                    source = source,
                    targetUnit = targetUnit,
                    budget = budget,
                    notes = notes
                )
                showAddLeadModal = false
            }
        )
    }

    // Buy Token Dialog
    if (showBuyTokenModal) {
        BuyTokenDialog(
            onDismiss = { showBuyTokenModal = false },
            onConfirm = { unit, amount ->
                viewModel.addTokenPurchase(unit, amount)
                showBuyTokenModal = false
            }
        )
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 11.sp
                )
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(accentColor.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = accentColor,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 15.sp
            )

            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 10.sp
            )
        }
    }
}

@Composable
fun QuickActionButton(
    title: String,
    icon: ImageVector,
    color: Color,
    onClick: () -> Unit,
    testTag: String
) {
    Button(
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = color.copy(alpha = 0.12f),
            contentColor = color
        ),
        modifier = Modifier.testTag(testTag)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = title,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun LeadCardItem(
    lead: PotentialTenant,
    onConvert: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = lead.name,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(IndigoPrimary.copy(alpha = 0.1f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = lead.source,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = IndigoPrimary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = "${lead.phone} • Minat: ${lead.targetUnit ?: "Kamar Bebas"}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 11.sp
                )
            }

            if (lead.status != "Converted") {
                Button(
                    onClick = onConvert,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldTertiary),
                    modifier = Modifier.height(32.dp)
                ) {
                    Text(text = "Jadikan Penghuni", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            } else {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(EmeraldTertiary.copy(alpha = 0.15f))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "Converted",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldTertiary
                    )
                }
            }
        }
    }
}

@Composable
fun MaintenanceTicketCard(
    req: MaintenanceRequest,
    onStatusChange: (String) -> Unit
) {
    val (statusBg, statusColor) = when (req.status) {
        "Resolved" -> Pair(EmeraldTertiary.copy(alpha = 0.15f), EmeraldTertiary)
        "In Progress" -> Pair(AmberSecondary.copy(alpha = 0.15f), AmberSecondary)
        else -> Pair(IndigoPrimary.copy(alpha = 0.15f), IndigoPrimary)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = req.unit,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    if (req.isEmergency) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(CoralError.copy(alpha = 0.15f))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "DARURAT",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = CoralError
                            )
                        }
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(statusBg)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = req.status,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = statusColor
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = req.issue,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.Medium
            )

            if (!req.description.isNullOrEmpty()) {
                Text(
                    text = req.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 11.sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = req.date,
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    if (req.status != "In Progress" && req.status != "Resolved") {
                        OutlinedButton(
                            onClick = { onStatusChange("In Progress") },
                            modifier = Modifier.height(28.dp),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Kerjakan", fontSize = 9.sp)
                        }
                    }
                    if (req.status != "Resolved") {
                        Button(
                            onClick = { onStatusChange("Resolved") },
                            modifier = Modifier.height(28.dp),
                            shape = RoundedCornerShape(6.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldTertiary)
                        ) {
                            Text("Selesai", fontSize = 9.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TransactionItemCard(tx: Transaction) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(
                        if (tx.isIncome) EmeraldTertiary.copy(alpha = 0.12f)
                        else CoralError.copy(alpha = 0.12f)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (tx.isIncome) Icons.Default.ArrowUpward else Icons.Default.ArrowDownward,
                    contentDescription = null,
                    tint = if (tx.isIncome) EmeraldTertiary else CoralError,
                    modifier = Modifier.size(18.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = tx.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "${tx.date} • Unit ${tx.unitId}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 11.sp
                )
            }

            Text(
                text = "${if (tx.isIncome) "+" else "-"} ${Formatters.formatRupiah(tx.amount)}",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = if (tx.isIncome) EmeraldTertiary else CoralError
            )
        }
    }
}

// Dialogs
@Composable
fun AddResidentDialog(
    onDismiss: () -> Unit,
    onConfirm: (name: String, email: String, room: String, phone: String, contactName: String, contactPhone: String, occupation: String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var room by remember { mutableStateOf("Room 206") }
    var phone by remember { mutableStateOf("") }
    var contactName by remember { mutableStateOf("") }
    var contactPhone by remember { mutableStateOf("") }
    var occupation by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Tambah Penghuni Baru", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Nama Lengkap") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = room,
                    onValueChange = { room = it },
                    label = { Text("Kamar (Unit)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Nomor Telepon (WhatsApp)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = occupation,
                    onValueChange = { occupation = it },
                    label = { Text("Pekerjaan / Instansi") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = contactName,
                    onValueChange = { contactName = it },
                    label = { Text("Kontak Darurat (Nama & Hubungan)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = contactPhone,
                    onValueChange = { contactPhone = it },
                    label = { Text("No. HP Kontak Darurat") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank() && room.isNotBlank()) {
                        onConfirm(name, email, room, phone, contactName, contactPhone, occupation)
                    }
                }
            ) {
                Text("Daftarkan")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Batal") }
        }
    )
}

@Composable
fun RecordPaymentDialog(
    onDismiss: () -> Unit,
    onConfirm: (title: String, amount: Long, isIncome: Boolean, unitId: String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var amountStr by remember { mutableStateOf("") }
    var isIncome by remember { mutableStateOf(true) }
    var unitId by remember { mutableStateOf("Room 101") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Catat Transaksi Keuangan", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { isIncome = true },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isIncome) EmeraldTertiary else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = if (isIncome) Color.White else MaterialTheme.colorScheme.onSurface
                        ),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Pemasukan (+)")
                    }
                    Button(
                        onClick = { isIncome = false },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (!isIncome) CoralError else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = if (!isIncome) Color.White else MaterialTheme.colorScheme.onSurface
                        ),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Pengeluaran (-)")
                    }
                }

                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Deskripsi Transaksi") },
                    placeholder = { Text("Contoh: Pembayaran Sewa Kamar 101") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = amountStr,
                    onValueChange = { amountStr = it },
                    label = { Text("Nominal (Rp)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = unitId,
                    onValueChange = { unitId = it },
                    label = { Text("Unit / Kamar Terkait") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val amount = amountStr.toLongOrNull() ?: 0L
                    if (title.isNotBlank() && amount > 0) {
                        onConfirm(title, amount, isIncome, unitId)
                    }
                }
            ) {
                Text("Simpan")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Batal") }
        }
    )
}

@Composable
fun NewMaintenanceDialog(
    onDismiss: () -> Unit,
    onConfirm: (unit: String, issue: String, desc: String, priority: String, isEmergency: Boolean) -> Unit
) {
    var unit by remember { mutableStateOf("Unit 205") }
    var issue by remember { mutableStateOf("") }
    var desc by remember { mutableStateOf("") }
    var priority by remember { mutableStateOf("Medium") }
    var isEmergency by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Lapor Pemeliharaan & Kerusakan", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = unit,
                    onValueChange = { unit = it },
                    label = { Text("Unit / Kamar") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = issue,
                    onValueChange = { issue = it },
                    label = { Text("Judul Masalah") },
                    placeholder = { Text("Contoh: AC Bocor / Lampu Mati") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = desc,
                    onValueChange = { desc = it },
                    label = { Text("Detail Deskripsi Kerusakan") },
                    modifier = Modifier.fillMaxWidth()
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Prioritas Darurat:")
                    Button(
                        onClick = { isEmergency = !isEmergency },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isEmergency) CoralError else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = if (isEmergency) Color.White else MaterialTheme.colorScheme.onSurface
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(if (isEmergency) "DARURAT !" else "Normal")
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (unit.isNotBlank() && issue.isNotBlank()) {
                        onConfirm(unit, issue, desc, priority, isEmergency)
                    }
                }
            ) {
                Text("Kirim Laporan")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Batal") }
        }
    )
}

@Composable
fun AddLeadDialog(
    onDismiss: () -> Unit,
    onConfirm: (name: String, phone: String, source: String, targetUnit: String, budget: Long, notes: String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var source by remember { mutableStateOf("Mamikos") }
    var targetUnit by remember { mutableStateOf("Room 206") }
    var budgetStr by remember { mutableStateOf("2500000") }
    var notes by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Tambah Calon Penghuni (Lead)", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Nama Calon Penghuni") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Nomor WhatsApp") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = source,
                    onValueChange = { source = it },
                    label = { Text("Sumber Lead (Mamikos/IG/WA/OLX)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = targetUnit,
                    onValueChange = { targetUnit = it },
                    label = { Text("Minat Kamar") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = budgetStr,
                    onValueChange = { budgetStr = it },
                    label = { Text("Budget Sewa (Rp)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Catatan Tambahan") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank() && phone.isNotBlank()) {
                        onConfirm(name, phone, source, targetUnit, budgetStr.toLongOrNull() ?: 0L, notes)
                    }
                }
            ) {
                Text("Simpan Prospek")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Batal") }
        }
    )
}

@Composable
fun BuyTokenDialog(
    onDismiss: () -> Unit,
    onConfirm: (unit: String, amount: Long) -> Unit
) {
    var unit by remember { mutableStateOf("Unit 101") }
    var selectedAmount by remember { mutableStateOf(100000L) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Beli Token Listrik PLN", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = unit,
                    onValueChange = { unit = it },
                    label = { Text("Unit / Kamar") },
                    modifier = Modifier.fillMaxWidth()
                )

                Text("Pilih Denominasi Token:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)

                val denominations = listOf(50000L, 100000L, 200000L, 500000L)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    denominations.forEach { denom ->
                        Button(
                            onClick = { selectedAmount = denom },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (selectedAmount == denom) AmberSecondary else MaterialTheme.colorScheme.surfaceVariant,
                                contentColor = if (selectedAmount == denom) Color.White else MaterialTheme.colorScheme.onSurface
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(4.dp)
                        ) {
                            Text("${denom / 1000}k", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (unit.isNotBlank() && selectedAmount > 0) {
                        onConfirm(unit, selectedAmount)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = AmberSecondary)
            ) {
                Text("Terbitkan Token")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Batal") }
        }
    )
}
