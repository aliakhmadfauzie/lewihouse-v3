package com.example.lewihouse.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.lewihouse.data.model.MaintenanceRequest
import com.example.lewihouse.data.model.PotentialTenant
import com.example.lewihouse.data.model.Resident
import com.example.lewihouse.data.model.TokenPurchase
import com.example.lewihouse.data.model.Transaction
import com.example.lewihouse.data.model.UnitOccupancy
import kotlinx.coroutines.flow.Flow

@Dao
interface ResidentDao {
    @Query("SELECT * FROM residents ORDER BY name ASC")
    fun getAllResidents(): Flow<List<Resident>>

    @Query("SELECT * FROM residents WHERE email = :email LIMIT 1")
    suspend fun getResidentByEmail(email: String): Resident?

    @Query("SELECT * FROM residents WHERE id = :id LIMIT 1")
    suspend fun getResidentById(id: String): Resident?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertResident(resident: Resident)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(residents: List<Resident>)

    @Update
    suspend fun updateResident(resident: Resident)

    @Query("DELETE FROM residents WHERE id = :id")
    suspend fun deleteResidentById(id: String)

    @Query("DELETE FROM residents")
    suspend fun clearAll()
}

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions ORDER BY rowid DESC")
    fun getAllTransactions(): Flow<List<Transaction>>

    @Query("SELECT * FROM transactions WHERE residentId = :residentId ORDER BY rowid DESC")
    fun getTransactionsForResident(residentId: String): Flow<List<Transaction>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: Transaction)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(transactions: List<Transaction>)

    @Query("DELETE FROM transactions")
    suspend fun clearAll()
}

@Dao
interface UnitDao {
    @Query("SELECT * FROM units ORDER BY unitNumber ASC")
    fun getAllUnits(): Flow<List<UnitOccupancy>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUnit(unit: UnitOccupancy)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(units: List<UnitOccupancy>)

    @Update
    suspend fun updateUnit(unit: UnitOccupancy)

    @Query("DELETE FROM units")
    suspend fun clearAll()
}

@Dao
interface MaintenanceDao {
    @Query("SELECT * FROM maintenance_requests ORDER BY rowid DESC")
    fun getAllRequests(): Flow<List<MaintenanceRequest>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRequest(request: MaintenanceRequest)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(requests: List<MaintenanceRequest>)

    @Update
    suspend fun updateRequest(request: MaintenanceRequest)

    @Query("UPDATE maintenance_requests SET status = :status WHERE id = :id")
    suspend fun updateStatus(id: String, status: String)

    @Query("DELETE FROM maintenance_requests WHERE id = :id")
    suspend fun deleteRequestById(id: String)

    @Query("DELETE FROM maintenance_requests")
    suspend fun clearAll()
}

@Dao
interface TokenPurchaseDao {
    @Query("SELECT * FROM token_purchases ORDER BY rowid DESC")
    fun getAllTokens(): Flow<List<TokenPurchase>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertToken(token: TokenPurchase)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(tokens: List<TokenPurchase>)

    @Query("DELETE FROM token_purchases")
    suspend fun clearAll()
}

@Dao
interface PotentialTenantDao {
    @Query("SELECT * FROM potential_tenants ORDER BY rowid DESC")
    fun getAllLeads(): Flow<List<PotentialTenant>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLead(lead: PotentialTenant)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(leads: List<PotentialTenant>)

    @Update
    suspend fun updateLead(lead: PotentialTenant)

    @Query("DELETE FROM potential_tenants WHERE id = :id")
    suspend fun deleteLeadById(id: String)

    @Query("DELETE FROM potential_tenants")
    suspend fun clearAll()
}
