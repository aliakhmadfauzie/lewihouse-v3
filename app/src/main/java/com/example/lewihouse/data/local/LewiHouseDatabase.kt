package com.example.lewihouse.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.lewihouse.data.model.MaintenanceRequest
import com.example.lewihouse.data.model.PotentialTenant
import com.example.lewihouse.data.model.Resident
import com.example.lewihouse.data.model.TokenPurchase
import com.example.lewihouse.data.model.Transaction
import com.example.lewihouse.data.model.UnitOccupancy

@Database(
    entities = [
        Resident::class,
        Transaction::class,
        UnitOccupancy::class,
        MaintenanceRequest::class,
        TokenPurchase::class,
        PotentialTenant::class
    ],
    version = 1,
    exportSchema = false
)
abstract class LewiHouseDatabase : RoomDatabase() {
    abstract fun residentDao(): ResidentDao
    abstract fun transactionDao(): TransactionDao
    abstract fun unitDao(): UnitDao
    abstract fun maintenanceDao(): MaintenanceDao
    abstract fun tokenPurchaseDao(): TokenPurchaseDao
    abstract fun potentialTenantDao(): PotentialTenantDao

    companion object {
        @Volatile
        private var INSTANCE: LewiHouseDatabase? = null

        fun getDatabase(context: Context): LewiHouseDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    LewiHouseDatabase::class.java,
                    "lewi_house_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
