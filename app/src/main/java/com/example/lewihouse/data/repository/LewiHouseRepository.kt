package com.example.lewihouse.data.repository

import com.example.lewihouse.data.local.LewiHouseDatabase
import com.example.lewihouse.data.model.MaintenanceRequest
import com.example.lewihouse.data.model.PotentialTenant
import com.example.lewihouse.data.model.Resident
import com.example.lewihouse.data.model.TokenPurchase
import com.example.lewihouse.data.model.Transaction
import com.example.lewihouse.data.model.UnitOccupancy
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.random.Random

class LewiHouseRepository(private val database: LewiHouseDatabase) {

    val residents: Flow<List<Resident>> = database.residentDao().getAllResidents()
    val transactions: Flow<List<Transaction>> = database.transactionDao().getAllTransactions()
    val units: Flow<List<UnitOccupancy>> = database.unitDao().getAllUnits()
    val maintenanceRequests: Flow<List<MaintenanceRequest>> = database.maintenanceDao().getAllRequests()
    val tokenPurchases: Flow<List<TokenPurchase>> = database.tokenPurchaseDao().getAllTokens()
    val potentialTenants: Flow<List<PotentialTenant>> = database.potentialTenantDao().getAllLeads()

    fun getTransactionsForResident(residentId: String): Flow<List<Transaction>> {
        return database.transactionDao().getTransactionsForResident(residentId)
    }

    suspend fun getResidentByEmail(email: String): Resident? {
        return database.residentDao().getResidentByEmail(email)
    }

    suspend fun addResident(
        name: String,
        email: String,
        room: String,
        status: String = "Paid",
        balance: Long = 0L,
        phone: String? = null,
        emergencyContactName: String? = null,
        emergencyContactPhone: String? = null,
        occupation: String? = null,
        avatarUrl: String? = null
    ): Resident {
        val newResident = Resident(
            id = "res_${System.currentTimeMillis()}",
            name = name,
            email = email,
            room = room,
            status = status,
            balance = balance,
            avatarUrl = avatarUrl ?: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            phone = phone ?: "+62 812-3456-7890",
            emergencyContactName = emergencyContactName,
            emergencyContactPhone = emergencyContactPhone,
            occupation = occupation
        )
        database.residentDao().insertResident(newResident)
        return newResident
    }

    suspend fun updateResident(resident: Resident) {
        database.residentDao().updateResident(resident)
    }

    suspend fun addTransaction(
        title: String,
        amount: Long,
        isIncome: Boolean,
        unitId: String,
        residentId: String
    ): Transaction {
        val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.US)
        val newTx = Transaction(
            id = "tx_${System.currentTimeMillis()}",
            title = title,
            amount = amount,
            date = dateFormat.format(Date()),
            isIncome = isIncome,
            unitId = unitId,
            residentId = residentId
        )
        database.transactionDao().insertTransaction(newTx)
        return newTx
    }

    suspend fun updateUnit(unit: UnitOccupancy) {
        database.unitDao().updateUnit(unit)
    }

    suspend fun addMaintenanceRequest(
        unit: String,
        issue: String,
        description: String? = null,
        priority: String = "Medium",
        isEmergency: Boolean = false
    ): MaintenanceRequest {
        val timeFormat = SimpleDateFormat("hh:mm a", Locale.US)
        val newReq = MaintenanceRequest(
            id = "m_${System.currentTimeMillis()}",
            unit = unit,
            issue = issue,
            description = description,
            priority = priority,
            date = "Today, " + timeFormat.format(Date()),
            status = "Pending",
            isEmergency = isEmergency
        )
        database.maintenanceDao().insertRequest(newReq)
        return newReq
    }

    suspend fun updateMaintenanceStatus(id: String, newStatus: String) {
        database.maintenanceDao().updateStatus(id, newStatus)
    }

    suspend fun addTokenPurchase(
        unit: String,
        amount: Long
    ): TokenPurchase {
        val timeFormat = SimpleDateFormat("hh:mm a", Locale.US)
        val tokenNumber = (1..4).joinToString("-") { "${Random.nextInt(1000, 9999)}" }
        val newPurchase = TokenPurchase(
            id = "tp_${System.currentTimeMillis()}",
            unit = unit,
            date = "Today, " + timeFormat.format(Date()),
            tokenNumber = tokenNumber,
            amount = amount,
            status = "Success"
        )
        database.tokenPurchaseDao().insertToken(newPurchase)
        return newPurchase
    }

    suspend fun addPotentialTenant(
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
    ): PotentialTenant {
        val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.US)
        val newLead = PotentialTenant(
            id = "lead_${System.currentTimeMillis()}",
            name = name,
            phone = phone,
            email = email,
            source = source,
            sourceDetails = sourceDetails,
            targetUnit = targetUnit,
            budget = budget,
            expectedMoveInDate = expectedMoveInDate,
            notes = notes,
            status = status,
            createdAt = dateFormat.format(Date())
        )
        database.potentialTenantDao().insertLead(newLead)
        return newLead
    }

    suspend fun updatePotentialTenant(lead: PotentialTenant) {
        database.potentialTenantDao().updateLead(lead)
    }

    suspend fun deletePotentialTenant(id: String) {
        database.potentialTenantDao().deleteLeadById(id)
    }

    suspend fun convertLeadToResident(leadId: String, initialRoom: String?, initialBalance: Long?): Resident? {
        val currentLeads = database.potentialTenantDao().getAllLeads().first()
        val lead = currentLeads.find { it.id == leadId } ?: return null
        val room = initialRoom ?: lead.targetUnit ?: "Room 101"

        val newResident = addResident(
            name = lead.name,
            email = lead.email ?: "${lead.name.lowercase(Locale.US).replace(" ", ".")}@example.com",
            room = room,
            status = "Paid",
            balance = initialBalance ?: 0L,
            phone = lead.phone,
            occupation = if (!lead.notes.isNullOrEmpty()) "Lead from ${lead.source}" else null
        )

        // Mark lead converted
        updatePotentialTenant(lead.copy(status = "Converted"))

        // Update unit if exists
        val currentUnits = database.unitDao().getAllUnits().first()
        val targetUnit = currentUnits.find { it.unitNumber == room }
        if (targetUnit != null) {
            updateUnit(targetUnit.copy(isOccupied = true, currentResidentId = newResident.id))
        }

        return newResident
    }

    suspend fun initializeSeedDataIfEmpty() {
        val currentResidents = database.residentDao().getAllResidents().first()
        if (currentResidents.isEmpty()) {
            seedDatabase()
        }
    }

    suspend fun seedDatabase() {
        clearAllData()

        val initialResidents = listOf(
            Resident(
                id = "res_1",
                name = "Budi Santoso",
                email = "budi@example.com",
                room = "Room 101",
                status = "Paid",
                balance = 0L,
                avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                phone = "+62 812-3456-7890",
                emergencyContactName = "Dewi Sartika (Spouse)",
                emergencyContactPhone = "+62 812-9988-7766",
                occupation = "Software Engineer"
            ),
            Resident(
                id = "res_2",
                name = "Siti Aminah",
                email = "siti@example.com",
                room = "Room 205",
                status = "Overdue",
                balance = 2500000L,
                avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                phone = "+62 813-9876-5432",
                emergencyContactName = "Ahmad Fauzi (Parent)",
                emergencyContactPhone = "+62 813-1122-3344",
                occupation = "Graphic Designer"
            ),
            Resident(
                id = "res_3",
                name = "Ananda Rizky",
                email = "ananda@example.com",
                room = "Room 102",
                status = "Paid",
                balance = 0L,
                avatarUrl = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
                phone = "+62 811-2233-4455",
                emergencyContactName = "Rina Kusuma (Sister)",
                emergencyContactPhone = "+62 811-4455-6677",
                occupation = "Financial Analyst"
            )
        )
        database.residentDao().insertAll(initialResidents)

        val initialTransactions = listOf(
            Transaction("tx1", "Rent Payment - Unit 101", 3500000L, "Oct 24, 2026", true, "101", "res_1"),
            Transaction("tx2", "AC Repair - Unit 205", 450000L, "Oct 23, 2026", false, "205", "res_2"),
            Transaction("tx3", "Rent Payment - Unit 102", 2500000L, "Today, 09:45 AM", true, "102", "res_3"),
            Transaction("tx4", "Water Pump Servicing", 850000L, "Oct 20, 2026", false, "Common", "")
        )
        database.transactionDao().insertAll(initialTransactions)

        val initialUnits = listOf(
            UnitOccupancy("u1", "Room 101", "Deluxe Suite", 3500000L, true, "res_1"),
            UnitOccupancy("u2", "Room 102", "Standard Room", 2500000L, true, "res_3"),
            UnitOccupancy("u3", "Room 205", "Executive Suite", 3200000L, true, "res_2"),
            UnitOccupancy("u4", "Room 206", "Standard Room", 2500000L, false, null),
            UnitOccupancy("u5", "Room 301", "Penthouse Unit", 5000000L, false, null)
        )
        database.unitDao().insertAll(initialUnits)

        val initialMaintenance = listOf(
            MaintenanceRequest("m1", "Unit 402", "Water Leak in Bathroom", "Pipe under sink is leaking water onto the tile floor continuously.", "High", "Today, 09:30 AM", "Pending", true),
            MaintenanceRequest("m2", "Unit 210", "AC Not Cooling", "Air conditioning runs but only blows room temperature air.", "Medium", "Yesterday, 14:15", "In Progress", false),
            MaintenanceRequest("m3", "Unit 105", "Loose Cabinet Door", "Hinge on upper kitchen cabinet came loose.", "Low", "Oct 24, 08:00 AM", "Pending", false)
        )
        database.maintenanceDao().insertAll(initialMaintenance)

        val initialTokens = listOf(
            TokenPurchase("tp1", "Unit 101", "Oct 24, 2026", "4829-1940-2049-5832", 100000L, "Success"),
            TokenPurchase("tp2", "Unit 102", "Oct 22, 2026", "9182-3849-1029-4729", 200000L, "Success"),
            TokenPurchase("tp3", "Unit 205", "Oct 20, 2026", "5739-1029-4820-1948", 150000L, "Success")
        )
        database.tokenPurchaseDao().insertAll(initialTokens)

        val initialLeads = listOf(
            PotentialTenant("lead_1", "Dimas Prasetyo", "+62 812-7788-9900", "dimas.prasetyo@gmail.com", "Mamikos", "Mamikos Listing - Deluxe Unit Inquiry", "Room 206", 2500000L, "2026-09-01", "Interested in 6-month upfront payment. Inquired about WiFi speed and parking space.", "Viewing Scheduled", "Oct 24, 2026"),
            PotentialTenant("lead_2", "Jessica Tan", "+62 819-3344-5566", "jessica.tan@outlook.com", "Instagram", "IG Story DM @lewihouse", "Room 301", 5000000L, "2026-09-15", "Asking for Penthouse unit photos and pet policy.", "New", "Oct 25, 2026"),
            PotentialTenant("lead_3", "Reza Firmansyah", "+62 878-1122-3344", null, "WhatsApp", "Direct WA from Google Maps listing", "Room 206", 2500000L, "2026-09-05", "Needs room with balcony and private bathroom.", "Follow Up", "Oct 23, 2026"),
            PotentialTenant("lead_4", "Aulia Rahma", "+62 856-4455-6677", null, "OLX", "OLX Kos Jakarta Selatan", "Room 101", 3500000L, "2026-10-01", "Working nearby in SCBD, looking for quiet workspace environment.", "New", "Oct 25, 2026")
        )
        database.potentialTenantDao().insertAll(initialLeads)
    }

    suspend fun clearAllData() {
        database.residentDao().clearAll()
        database.transactionDao().clearAll()
        database.unitDao().clearAll()
        database.maintenanceDao().clearAll()
        database.tokenPurchaseDao().clearAll()
        database.potentialTenantDao().clearAll()
    }
}
