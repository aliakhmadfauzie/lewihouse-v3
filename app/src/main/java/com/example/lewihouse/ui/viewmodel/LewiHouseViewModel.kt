package com.example.lewihouse.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lewihouse.data.model.BottomNavTab
import com.example.lewihouse.data.model.FeatureFlags
import com.example.lewihouse.data.model.MaintenanceRequest
import com.example.lewihouse.data.model.PotentialTenant
import com.example.lewihouse.data.model.Resident
import com.example.lewihouse.data.model.ToastNotification
import com.example.lewihouse.data.model.TokenPurchase
import com.example.lewihouse.data.model.Transaction
import com.example.lewihouse.data.model.UnitOccupancy
import com.example.lewihouse.data.model.UserProfileInfo
import com.example.lewihouse.data.model.UserRole
import com.example.lewihouse.data.repository.LewiHouseRepository
import com.example.lewihouse.utils.EN_STRINGS
import com.example.lewihouse.utils.ID_STRINGS
import com.example.lewihouse.utils.StringsDict
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.random.Random

data class FinancialMetrics(
    val totalRevenue: Long = 0L,
    val totalExpenses: Long = 0L,
    val netProfit: Long = 0L,
    val outstandingBalance: Long = 0L,
    val occupiedUnitsCount: Int = 0,
    val totalUnitsCount: Int = 0,
    val occupancyRate: Int = 0
)

class LewiHouseViewModel(
    private val repository: LewiHouseRepository
) : ViewModel() {

    private val _isAuthenticated = MutableStateFlow(true)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated.asStateFlow()

    private val _userRole = MutableStateFlow(UserRole.ADMIN)
    val userRole: StateFlow<UserRole> = _userRole.asStateFlow()

    private val _currentTab = MutableStateFlow(BottomNavTab.DASHBOARD)
    val currentTab: StateFlow<BottomNavTab> = _currentTab.asStateFlow()

    private val _language = MutableStateFlow("ID")
    val language: StateFlow<String> = _language.asStateFlow()

    private val _isDarkMode = MutableStateFlow(false)
    val isDarkMode: StateFlow<Boolean> = _isDarkMode.asStateFlow()

    private val _isNotificationDrawerOpen = MutableStateFlow(false)
    val isNotificationDrawerOpen: StateFlow<Boolean> = _isNotificationDrawerOpen.asStateFlow()

    private val _toasts = MutableStateFlow<List<ToastNotification>>(emptyList())
    val toasts: StateFlow<List<ToastNotification>> = _toasts.asStateFlow()

    private val _notificationHistory = MutableStateFlow<List<ToastNotification>>(
        listOf(
            ToastNotification(
                id = "init_notif_1",
                title = "Status Tiket Diperbarui",
                message = "Unit 210: \"AC Not Cooling\" status telah diperbarui menjadi Sedang Dikerjakan.",
                type = "warning",
                unit = "Unit 210",
                status = "In Progress",
                timestamp = "14:15"
            ),
            ToastNotification(
                id = "init_notif_2",
                title = "Laporan Pemeliharaan Baru Masuk",
                message = "Unit 402 melaporkan masalah: \"Water Leak in Bathroom\" (Prioritas Tinggi - DARURAT)",
                type = "alert",
                unit = "Unit 402",
                status = "Pending",
                timestamp = "09:30"
            )
        )
    )
    val notificationHistory: StateFlow<List<ToastNotification>> = _notificationHistory.asStateFlow()

    private val _featureFlags = MutableStateFlow(FeatureFlags())
    val featureFlags: StateFlow<FeatureFlags> = _featureFlags.asStateFlow()

    private val _adminProfile = MutableStateFlow(
        UserProfileInfo(
            name = "Ali Akhmad Fauzi",
            email = "aliakhmadfauzie@gmail.com",
            phone = "+62 812-8899-0011",
            role = UserRole.ADMIN,
            avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            emergencyContactName = "Management Security Central",
            emergencyContactPhone = "+62 811-0000-9988",
            occupation = "Property General Manager",
            memberSince = "January 2025"
        )
    )

    val residents: StateFlow<List<Resident>> = repository.residents
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transactions: StateFlow<List<Transaction>> = repository.transactions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val units: StateFlow<List<UnitOccupancy>> = repository.units
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val maintenanceRequests: StateFlow<List<MaintenanceRequest>> = repository.maintenanceRequests
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val tokenPurchases: StateFlow<List<TokenPurchase>> = repository.tokenPurchases
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val potentialTenants: StateFlow<List<PotentialTenant>> = repository.potentialTenants
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val metrics: StateFlow<FinancialMetrics> = combine(transactions, residents, units) { txList, resList, unitList ->
        val rev = txList.filter { it.isIncome }.sumOf { it.amount }
        val exp = txList.filter { !it.isIncome }.sumOf { it.amount }
        val net = rev - exp
        val overdue = resList.filter { it.status.equals("Overdue", ignoreCase = true) }.sumOf { it.balance }
        val totalU = unitList.size
        val occupiedU = unitList.count { it.isOccupied }
        val rate = if (totalU > 0) ((occupiedU.toDouble() / totalU) * 100).toInt() else 0

        FinancialMetrics(
            totalRevenue = rev,
            totalExpenses = exp,
            netProfit = net,
            outstandingBalance = overdue,
            occupiedUnitsCount = occupiedU,
            totalUnitsCount = totalU,
            occupancyRate = rate
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), FinancialMetrics())

    val currentResident: StateFlow<Resident?> = combine(residents, _userRole) { resList, _ ->
        resList.find { it.email == "siti@example.com" } ?: resList.firstOrNull()
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val currentUserProfile: StateFlow<UserProfileInfo> = combine(
        _userRole,
        _adminProfile,
        currentResident
    ) { role, admin, resident ->
        when (role) {
            UserRole.TENANT -> {
                if (resident != null) {
                    UserProfileInfo(
                        name = resident.name,
                        email = resident.email,
                        phone = resident.phone ?: "+62 813-9876-5432",
                        role = UserRole.TENANT,
                        avatarUrl = resident.avatarUrl,
                        emergencyContactName = resident.emergencyContactName ?: "Ahmad Fauzi (Parent)",
                        emergencyContactPhone = resident.emergencyContactPhone ?: "+62 813-1122-3344",
                        room = resident.room,
                        occupation = resident.occupation ?: "Creative Designer & Resident",
                        memberSince = "March 2025"
                    )
                } else {
                    admin
                }
            }
            UserRole.DEVELOPER -> {
                UserProfileInfo(
                    name = "System Developer",
                    email = "developer@lewihouse.com",
                    phone = "+62 819-0011-2233",
                    role = UserRole.DEVELOPER,
                    avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                    emergencyContactName = "Infrastructure Lead",
                    emergencyContactPhone = "+62 819-9988-7766",
                    occupation = "Platform Engineer",
                    memberSince = "September 2024"
                )
            }
            UserRole.ADMIN -> admin
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), _adminProfile.value)

    init {
        viewModelScope.launch {
            repository.initializeSeedDataIfEmpty()
        }
    }

    val strings: StringsDict
        get() = if (_language.value == "ID") ID_STRINGS else EN_STRINGS

    fun bypassLogin(role: UserRole) {
        _userRole.value = role
        _isAuthenticated.value = true
        _currentTab.value = when (role) {
            UserRole.ADMIN -> BottomNavTab.DASHBOARD
            UserRole.TENANT -> BottomNavTab.HOME
            UserRole.DEVELOPER -> BottomNavTab.DEV_HOME
        }
    }

    fun signOut() {
        _isAuthenticated.value = false
        _currentTab.value = BottomNavTab.HOME
    }

    fun signInWithGoogle() {
        bypassLogin(UserRole.ADMIN)
    }

    fun setTab(tab: BottomNavTab) {
        _currentTab.value = tab
    }

    fun toggleLanguage() {
        _language.value = if (_language.value == "ID") "EN" else "ID"
    }

    fun toggleDarkMode() {
        _isDarkMode.value = !_isDarkMode.value
    }

    fun setDarkMode(enabled: Boolean) {
        _isDarkMode.value = enabled
    }

    fun setNotificationDrawerOpen(open: Boolean) {
        _isNotificationDrawerOpen.value = open
    }

    fun addToast(
        title: String,
        message: String,
        type: String = "info",
        unit: String? = null,
        status: String? = null,
        duration: Long = 5000L
    ) {
        val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())
        val newToast = ToastNotification(
            id = "toast_${System.currentTimeMillis()}_${Random.nextInt(100, 999)}",
            title = title,
            message = message,
            type = type,
            unit = unit,
            status = status,
            timestamp = timeFormat.format(Date()),
            duration = duration
        )
        _toasts.value = listOf(newToast) + _toasts.value.take(2)
        _notificationHistory.value = (listOf(newToast) + _notificationHistory.value).take(50)
    }

    fun removeToast(id: String) {
        _toasts.value = _toasts.value.filter { it.id != id }
    }

    fun clearAllNotifications() {
        _notificationHistory.value = emptyList()
    }

    fun addResident(
        name: String,
        email: String,
        room: String,
        status: String = "Paid",
        balance: Long = 0L,
        phone: String? = null,
        emergencyContactName: String? = null,
        emergencyContactPhone: String? = null,
        occupation: String? = null
    ) {
        viewModelScope.launch {
            repository.addResident(
                name = name,
                email = email,
                room = room,
                status = status,
                balance = balance,
                phone = phone,
                emergencyContactName = emergencyContactName,
                emergencyContactPhone = emergencyContactPhone,
                occupation = occupation
            )
            addToast(
                title = if (_language.value == "ID") "Penghuni Ditambahkan" else "Resident Added",
                message = "$name ($room) ${if (_language.value == "ID") "berhasil didaftarkan." else "successfully registered."}",
                type = "success"
            )
        }
    }

    fun updateResident(resident: Resident) {
        viewModelScope.launch {
            repository.updateResident(resident)
        }
    }

    fun updateProfile(
        name: String,
        phone: String,
        emergencyName: String?,
        emergencyPhone: String?,
        occupation: String?
    ) {
        if (_userRole.value == UserRole.TENANT) {
            val res = currentResident.value
            if (res != null) {
                viewModelScope.launch {
                    repository.updateResident(
                        res.copy(
                            name = name,
                            phone = phone,
                            emergencyContactName = emergencyName,
                            emergencyContactPhone = emergencyPhone,
                            occupation = occupation
                        )
                    )
                }
            }
        } else {
            _adminProfile.value = _adminProfile.value.copy(
                name = name,
                phone = phone,
                emergencyContactName = emergencyName,
                emergencyContactPhone = emergencyPhone,
                occupation = occupation
            )
        }
        addToast(
            title = if (_language.value == "ID") "Profil Diperbarui" else "Profile Updated",
            message = if (_language.value == "ID") "Informasi profil Anda berhasil disimpan." else "Profile info saved successfully.",
            type = "success"
        )
    }

    fun changePassword(oldPass: String, newPass: String): Pair<Boolean, String> {
        if (oldPass.isBlank()) {
            return Pair(false, if (_language.value == "ID") "Masukkan kata sandi lama." else "Please enter your current password.")
        }
        if (newPass.length < 6) {
            return Pair(false, if (_language.value == "ID") "Kata sandi baru minimal 6 karakter." else "New password must be at least 6 characters.")
        }
        if (oldPass == newPass) {
            return Pair(false, if (_language.value == "ID") "Kata sandi baru tidak boleh sama dengan kata sandi lama." else "New password cannot be identical to old password.")
        }
        return Pair(true, if (_language.value == "ID") "Kata sandi berhasil diperbarui!" else "Password changed successfully!")
    }

    fun addTransaction(
        title: String,
        amount: Long,
        isIncome: Boolean,
        unitId: String,
        residentId: String
    ) {
        viewModelScope.launch {
            repository.addTransaction(title, amount, isIncome, unitId, residentId)
            addToast(
                title = if (isIncome) (if (_language.value == "ID") "Pemasukan Dicatat" else "Income Recorded") else (if (_language.value == "ID") "Pengeluaran Dicatat" else "Expense Recorded"),
                message = "$title : Rp $amount",
                type = if (isIncome) "success" else "info"
            )
        }
    }

    fun addMaintenanceRequest(
        unit: String,
        issue: String,
        description: String? = null,
        priority: String = "Medium",
        isEmergency: Boolean = false
    ) {
        viewModelScope.launch {
            val req = repository.addMaintenanceRequest(unit, issue, description, priority, isEmergency)
            val title = if (_language.value == "ID") "Laporan Pemeliharaan Baru" else "New Maintenance Request"
            val message = if (_language.value == "ID") {
                "$unit melaporkan: \"$issue\" (Prioritas $priority${if (isEmergency) " - DARURAT" else ""})"
            } else {
                "$unit reported: \"$issue\" ($priority Priority${if (isEmergency) " - EMERGENCY" else ""})"
            }
            addToast(
                title = title,
                message = message,
                type = if (isEmergency) "alert" else "info",
                unit = unit,
                status = "Pending"
            )
        }
    }

    fun updateMaintenanceStatus(id: String, newStatus: String, customNote: String? = null) {
        viewModelScope.launch {
            repository.updateMaintenanceStatus(id, newStatus)
            val req = maintenanceRequests.value.find { it.id == id }
            val unit = req?.unit ?: "Unit"
            val issue = req?.issue ?: "Issue"
            val title = if (_language.value == "ID") "Update Status Pemeliharaan" else "Maintenance Status Update"
            val msg = if (_language.value == "ID") {
                "$unit: \"$issue\" status telah diperbarui menjadi $newStatus.${if (!customNote.isNullOrEmpty()) " Catatan: $customNote" else ""}"
            } else {
                "$unit: \"$issue\" status updated to $newStatus.${if (!customNote.isNullOrEmpty()) " Note: $customNote" else ""}"
            }
            addToast(
                title = title,
                message = msg,
                type = if (newStatus == "Resolved") "success" else if (newStatus == "In Progress") "warning" else "info",
                unit = unit,
                status = newStatus
            )
        }
    }

    fun simulateTechnicianUpdate() {
        val list = maintenanceRequests.value
        if (list.isEmpty()) {
            viewModelScope.launch {
                val sample = repository.addMaintenanceRequest(
                    unit = "Room 205",
                    issue = "Perbaikan Lampu Balkon & Steker",
                    description = "Lampu balkon kedip-kedip dan steker listrik longgar",
                    priority = "Medium",
                    isEmergency = false
                )
                updateMaintenanceStatus(sample.id, "In Progress", if (_language.value == "ID") "Teknisi sedang menuju ke lokasi" else "Technician en route")
            }
            return
        }

        val target = list.random()
        val nextStatus = when (target.status) {
            "Pending" -> "In Progress"
            "In Progress" -> "Resolved"
            else -> "In Progress"
        }
        val note = when (nextStatus) {
            "In Progress" -> if (_language.value == "ID") "Teknisi ditugaskan ke lokasi" else "Technician dispatched"
            "Resolved" -> if (_language.value == "ID") "Perbaikan selesai dan terverifikasi" else "Repair verified and completed"
            else -> if (_language.value == "ID") "Menunggu ketersediaan suku cadang" else "Awaiting spare parts"
        }
        updateMaintenanceStatus(target.id, nextStatus, note)
    }

    fun addTokenPurchase(unit: String, amount: Long) {
        viewModelScope.launch {
            val token = repository.addTokenPurchase(unit, amount)
            addToast(
                title = if (_language.value == "ID") "Token Listrik Terbit!" else "Electricity Token Issued!",
                message = "$unit: Token ${token.tokenNumber} (Rp $amount)",
                type = "success"
            )
        }
    }

    fun addPotentialTenant(
        name: String,
        phone: String,
        email: String? = null,
        source: String = "Mamikos",
        sourceDetails: String? = null,
        targetUnit: String? = null,
        budget: Long? = null,
        expectedMoveInDate: String? = null,
        notes: String? = null,
        status: String = "New"
    ) {
        viewModelScope.launch {
            repository.addPotentialTenant(
                name, phone, email, source, sourceDetails, targetUnit, budget, expectedMoveInDate, notes, status
            )
            addToast(
                title = if (_language.value == "ID") "Prospek Baru Disimpan" else "New Lead Added",
                message = "$name ($source) ${if (_language.value == "ID") "berhasil ditambahkan." else "added successfully."}",
                type = "info"
            )
        }
    }

    fun updatePotentialTenant(lead: PotentialTenant) {
        viewModelScope.launch {
            repository.updatePotentialTenant(lead)
        }
    }

    fun deletePotentialTenant(id: String) {
        viewModelScope.launch {
            repository.deletePotentialTenant(id)
            addToast(
                title = if (_language.value == "ID") "Prospek Dihapus" else "Lead Removed",
                message = if (_language.value == "ID") "Data calon penghuni berhasil dihapus." else "Lead removed from system.",
                type = "info"
            )
        }
    }

    fun convertLeadToResident(leadId: String, initialRoom: String? = null, initialBalance: Long? = null) {
        viewModelScope.launch {
            val res = repository.convertLeadToResident(leadId, initialRoom, initialBalance)
            if (res != null) {
                addToast(
                    title = if (_language.value == "ID") "Berhasil Jadi Penghuni!" else "Converted to Resident!",
                    message = "${res.name} ${if (_language.value == "ID") "resmi terdaftar di kamar" else "registered for room"} ${res.room}",
                    type = "success"
                )
            }
        }
    }

    fun updateFeatureFlags(flags: FeatureFlags) {
        _featureFlags.value = flags
    }

    fun seedData() {
        viewModelScope.launch {
            repository.seedDatabase()
            addToast(
                title = if (_language.value == "ID") "Database Direset & Diisi" else "Database Seeded",
                message = if (_language.value == "ID") "Data contoh berhasil dimuat ulang." else "Demo data successfully reloaded.",
                type = "success"
            )
        }
    }

    fun clearData() {
        viewModelScope.launch {
            repository.clearAllData()
            addToast(
                title = if (_language.value == "ID") "Database Dikosongkan" else "Database Cleared",
                message = if (_language.value == "ID") "Semua data lokal telah dihapus." else "All local records erased.",
                type = "warning"
            )
        }
    }
}
