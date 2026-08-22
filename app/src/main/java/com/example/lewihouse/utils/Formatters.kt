package com.example.lewihouse.utils

import java.text.NumberFormat
import java.util.Locale

object Formatters {
    fun formatRupiah(amount: Long): String {
        val formatter = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
        formatter.maximumFractionDigits = 0
        return formatter.format(amount).replace("Rp", "Rp ").trim()
    }

    fun formatNumber(amount: Long): String {
        val formatter = NumberFormat.getNumberInstance(Locale("id", "ID"))
        return formatter.format(amount)
    }
}
