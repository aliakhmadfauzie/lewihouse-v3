package com.example.lewihouse.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

enum class UserRole {
    ADMIN, TENANT, DEVELOPER
}

enum class BottomNavTab {
    DASHBOARD,
    RESIDENTS,
    PAYMENTS,
    ROOMS,
    HOME,
    BILLS,
    UTILITIES,
    MAINTENANCE,
    PROFILE,
    DEV_HOME,
    LEADS
}

@Serializable
@Entity(tableName = "residents")
data class Resident(
    @PrimaryKey val id: String,
    val name: String,
    val email: String,
    val room: String,
    val status: String, // "Paid", "Overdue", "Pending"
    val balance: Long,
    val avatarUrl: String? = null,
    val fcmToken: String? = null,
    val phone: String? = null,
    val emergencyContactName: String? = null,
    val emergencyContactPhone: String? = null,
    val occupation: String? = null
)

@Serializable
@Entity(tableName = "potential_tenants")
data class PotentialTenant(
    @PrimaryKey val id: String,
    val name: String,
    val phone: String,
    val email: String? = null,
    val source: String, // "Mamikos", "Instagram", "WhatsApp", "OLX", "TikTok", "Google Maps", "Direct Walk-in", "Referral", "Other"
    val sourceDetails: String? = null,
    val targetUnit: String? = null,
    val budget: Long? = null,
    val expectedMoveInDate: String? = null,
    val notes: String? = null,
    val status: String, // "New", "Viewing Scheduled", "Follow Up", "Converted", "Cancelled"
    val createdAt: String
)

@Serializable
data class UserProfileInfo(
    val name: String,
    val email: String,
    val phone: String,
    val role: UserRole,
    val avatarUrl: String? = null,
    val emergencyContactName: String? = null,
    val emergencyContactPhone: String? = null,
    val room: String? = null,
    val occupation: String? = null,
    val memberSince: String? = null
)

@Serializable
@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey val id: String,
    val title: String,
    val amount: Long,
    val date: String,
    val isIncome: Boolean,
    val unitId: String,
    val residentId: String
)

@Serializable
@Entity(tableName = "units")
data class UnitOccupancy(
    @PrimaryKey val id: String,
    val unitNumber: String,
    val type: String,
    val price: Long,
    val isOccupied: Boolean,
    val currentResidentId: String? = null
)

@Serializable
@Entity(tableName = "maintenance_requests")
data class MaintenanceRequest(
    @PrimaryKey val id: String,
    val unit: String,
    val issue: String,
    val description: String? = null,
    val priority: String, // "High", "Medium", "Low"
    val date: String,
    val status: String, // "Pending", "In Progress", "Resolved"
    val isEmergency: Boolean = false,
    val photoUrl: String? = null
)

@Serializable
@Entity(tableName = "token_purchases")
data class TokenPurchase(
    @PrimaryKey val id: String,
    val unit: String,
    val date: String,
    val tokenNumber: String,
    val amount: Long,
    val status: String // "Success", "Pending", "Failed"
)

@Serializable
data class ToastNotification(
    val id: String,
    val title: String,
    val message: String,
    val type: String = "info", // "info", "success", "warning", "alert"
    val requestId: String? = null,
    val unit: String? = null,
    val status: String? = null,
    val timestamp: String,
    val duration: Long = 5000L
)

@Serializable
data class FeatureFlags(
    val bypassAuth: Boolean = true,
    val verboseLogging: Boolean = false,
    val mockDataMode: Boolean = true,
    val forceStagingApi: Boolean = false
)
