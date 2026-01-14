package com.example.mobiledatamonitor

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update

@Dao
interface AppLimitDao {
    @Query("SELECT * FROM app_limits")
    suspend fun getAll(): List<AppLimit>
    
    @Query("SELECT * FROM app_limits WHERE packageName = :packageName")
    suspend fun getByPackage(packageName: String): AppLimit?
    
    @Insert
    suspend fun insert(appLimit: AppLimit)
    
    @Update
    suspend fun update(appLimit: AppLimit)
    
    @Query("DELETE FROM app_limits WHERE packageName = :packageName")
    suspend fun delete(packageName: String)
}
