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
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
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
import com.example.lewihouse.ui.theme.AmberSecondary
import com.example.lewihouse.ui.theme.CoralError
import com.example.lewihouse.ui.theme.EmeraldTertiary
import com.example.lewihouse.ui.theme.IndigoPrimary
import com.example.lewihouse.ui.viewmodel.LewiHouseViewModel
import com.example.lewihouse.utils.Formatters

@Composable
fun PaymentsScreen(
    viewModel: LewiHouseViewModel
) {
    val transactions by viewModel.transactions.collectAsStateWithLifecycle()
    val metrics by viewModel.metrics.collectAsStateWithLifecycle()
    val strings = viewModel.strings

    var filterType by remember { mutableStateOf("All") }
    var showRecordModal by remember { mutableStateOf(false) }

    val filteredTransactions = transactions.filter { tx ->
        when (filterType) {
            "Income" -> tx.isIncome
            "Expense" -> !tx.isIncome
            else -> true
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showRecordModal = true },
                containerColor = IndigoPrimary,
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier.testTag("fab_record_payment")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Record Payment")
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .testTag("payments_screen")
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            // Income / Expense summary pills
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                MetricCard(
                    title = "Total Pemasukan",
                    value = Formatters.formatRupiah(metrics.totalRevenue),
                    subtitle = "Sewa & Utilitas",
                    icon = Icons.Default.ArrowUpward,
                    accentColor = EmeraldTertiary,
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    title = "Total Pengeluaran",
                    value = Formatters.formatRupiah(metrics.totalExpenses),
                    subtitle = "Maintenance & Ops",
                    icon = Icons.Default.ArrowDownward,
                    accentColor = CoralError,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Filter Tabs
            val filters = listOf(
                Pair("All", "Semua Transaksi (${transactions.size})"),
                Pair("Income", "Pemasukan (${transactions.count { it.isIncome }})"),
                Pair("Expense", "Pengeluaran (${transactions.count { !it.isIncome }})")
            )

            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(filters) { (key, label) ->
                    val isSelected = filterType == key
                    Button(
                        onClick = { filterType = key },
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
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(filteredTransactions, key = { it.id }) { tx ->
                    TransactionItemCard(tx = tx)
                }

                item {
                    Spacer(modifier = Modifier.height(72.dp))
                }
            }
        }
    }

    if (showRecordModal) {
        RecordPaymentDialog(
            onDismiss = { showRecordModal = false },
            onConfirm = { title, amount, isIncome, unitId ->
                viewModel.addTransaction(title, amount, isIncome, unitId, "")
                showRecordModal = false
            }
        )
    }
}
