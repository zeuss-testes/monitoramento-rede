package com.example.mobiledatamonitor

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "app_limits")
data class AppLimit(
    @PrimaryKey
    val packageName: String,
    val timeLimit: Long, // in milliseconds
    val isWhitelisted: Boolean = false
)
