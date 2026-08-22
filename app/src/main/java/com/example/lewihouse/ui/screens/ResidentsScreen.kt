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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.MeetingRoom
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.lewihouse.data.model.Resident
import com.example.lewihouse.ui.theme.AmberSecondary
import com.example.lewihouse.ui.theme.CoralError
import com.example.lewihouse.ui.theme.EmeraldTertiary
import com.example.lewihouse.ui.theme.IndigoPrimary
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModel
import com.example.lewihouse.utils.Formatters

@Composable
fun ResidentsScreen(
    viewModel: LewiHouseViewModel
) {
    val residents by viewModel.residents.collectAsStateWithLifecycle()
    val strings = viewModel.strings

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }
    var showAddDialog by remember { mutableStateOf(false) }

    val filteredResidents = residents.filter { res ->
        val matchesSearch = res.name.contains(searchQuery, ignoreCase = true) ||
                res.room.contains(searchQuery, ignoreCase = true) ||
                (res.phone?.contains(searchQuery, ignoreCase = true) ?: false)
        val matchesFilter = when (selectedFilter) {
            "Paid" -> res.status.equals("Paid", ignoreCase = true)
            "Overdue" -> res.status.equals("Overdue", ignoreCase = true)
            "Pending" -> res.status.equals("Pending", ignoreCase = true)
            else -> true
        }
        matchesSearch && matchesFilter
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier.testTag("fab_add_resident")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Resident")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .testTag("residents_screen")
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            // Search Box
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("resident_search_input"),
                placeholder = { Text(strings.searchPlaceholder, fontSize = 13.sp) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                },
                shape = RoundedCornerShape(14.dp),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Filter Pills
            val filterOptions = listOf(
                Pair("All", "Semua (${residents.size})"),
                Pair("Paid", "Lunas (${residents.count { it.status.equals("Paid", true) }})"),
                Pair("Overdue", "Menunggak (${residents.count { it.status.equals("Overdue", true) }})"),
                Pair("Pending", "Pending (${residents.count { it.status.equals("Pending", true) }})")
            )

            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(filterOptions) { (key, label) ->
                    val isSelected = selectedFilter == key
                    Button(
                        onClick = { selectedFilter = key },
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

            // Resident List
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredResidents, key = { it.id }) { resident ->
                    ResidentCard(
                        resident = resident,
                        onTransferRoom = {
                            viewModel.updateResident(resident.copy(room = if (resident.room == "Room 101") "Room 205" else "Room 101"))
                        },
                        onTogglePaid = {
                            val nextStatus = if (resident.status == "Paid") "Overdue" else "Paid"
                            val nextBalance = if (nextStatus == "Overdue") 2500000L else 0L
                            viewModel.updateResident(resident.copy(status = nextStatus, balance = nextBalance))
                        }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(72.dp))
                }
            }
        }
    }

    if (showAddDialog) {
        AddResidentDialog(
            onDismiss = { showAddDialog = false },
            onConfirm = { name, email, room, phone, contactName, contactPhone, occupation ->
                viewModel.addResident(name, email, room, phone = phone, emergencyContactName = contactName, emergencyContactPhone = contactPhone, occupation = occupation)
                showAddDialog = false
            }
        )
    }
}

@Composable
fun ResidentCard(
    resident: Resident,
    onTransferRoom: () -> Unit,
    onTogglePaid: () -> Unit
) {
    val isOverdue = resident.status.equals("Overdue", ignoreCase = true)
    val (badgeBg, badgeColor) = if (isOverdue) {
        Pair(CoralError.copy(alpha = 0.15f), CoralError)
    } else {
        Pair(EmeraldTertiary.copy(alpha = 0.15f), EmeraldTertiary)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("resident_card_${resident.id}"),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Avatar circle
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(IndigoPrimary.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = IndigoPrimary,
                        modifier = Modifier.size(24.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = resident.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Text(
                        text = "${resident.room} • ${resident.occupation ?: "Penghuni Eksekutif"}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 11.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(badgeBg)
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = resident.status,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = badgeColor
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Details info
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Phone,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = resident.phone ?: "+62 812-3456-7890",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Text(
                    text = if (resident.balance > 0) "Tunggakan: ${Formatters.formatRupiah(resident.balance)}" else "Tagihan Lunas",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (resident.balance > 0) CoralError else EmeraldTertiary
                )
            }

            if (!resident.emergencyContactName.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Kontak Darurat: ${resident.emergencyContactName} (${resident.emergencyContactPhone ?: "-"})",
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Action row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = onTogglePaid,
                    modifier = Modifier
                        .weight(1f)
                        .height(32.dp),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(if (isOverdue) "Tandai Lunas" else "Tandai Nunggak", fontSize = 10.sp)
                }

                OutlinedButton(
                    onClick = onTransferRoom,
                    modifier = Modifier
                        .weight(1f)
                        .height(32.dp),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Pindah Kamar", fontSize = 10.sp)
                }
            }
        }
    }
}
