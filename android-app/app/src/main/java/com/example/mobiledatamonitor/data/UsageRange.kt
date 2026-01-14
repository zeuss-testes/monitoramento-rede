package com.example.mobiledatamonitor.data

import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.YearMonth

enum class UsageRange(val displayName: String) {
    TODAY("Hoje"),
    LAST_7_DAYS("Últimos 7 dias"),
    CURRENT_MONTH("Mês atual");

    fun computeStartTimestamp(nowMillis: Long = System.currentTimeMillis()): Long {
        val zoneId = ZoneId.systemDefault()
        val now = Instant.ofEpochMilli(nowMillis).atZone(zoneId).toLocalDate()
        
        return when (this) {
            TODAY -> {
                now.atStartOfDay(zoneId).toInstant().toEpochMilli()
            }
            LAST_7_DAYS -> {
                now.minusDays(6).atStartOfDay(zoneId).toInstant().toEpochMilli()
            }
            CURRENT_MONTH -> {
                now.withDayOfMonth(1).atStartOfDay(zoneId).toInstant().toEpochMilli()
            }
        }
    }
}
