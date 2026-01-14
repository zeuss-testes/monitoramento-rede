package com.example.mobiledatamonitor.data

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.YearMonth
import java.time.ZoneId

data class UsageDeltaResult(
    val sentMegabytes: Double,
    val timestamp: Instant
)

data class UsageSyncResult(
    val success: Boolean,
    val syncedMb: Double,
    val timestamp: Instant
)

object BackendSyncHelper {
    private const val KEY_LAST_TOTAL_MOBILE_BYTES = "last_total_mobile_bytes"
    private const val KEY_LAST_SYNC_MONTH = "last_sync_month"
    private const val MIN_DELTA_MB = 0.1

    suspend fun syncDeltaIfNeeded(
        context: Context,
        prefs: SharedPreferences,
        totals: UsageTotals
    ): UsageDeltaResult? {
        val mobileBytes = totals.mobileRxBytes + totals.mobileTxBytes
        val lastBytes = prefs.getLong(KEY_LAST_TOTAL_MOBILE_BYTES, -1L)
        
        if (mobileBytes <= 0L) {
            prefs.edit().putLong(KEY_LAST_TOTAL_MOBILE_BYTES, mobileBytes).apply()
            return null
        }

        val delta = if (lastBytes >= 0L && mobileBytes > lastBytes) {
            mobileBytes - lastBytes
        } else {
            0L
        }

        prefs.edit().putLong(KEY_LAST_TOTAL_MOBILE_BYTES, mobileBytes).apply()
        if (delta <= 0L) return null

        val megabytes = delta.toDouble() / (1024.0 * 1024.0)
        if (megabytes < MIN_DELTA_MB) return null

        return syncUsage(context, prefs, megabytes)?.let {
            UsageDeltaResult(
                sentMegabytes = it.syncedMb,
                timestamp = it.timestamp
            )
        }
    }

    suspend fun syncUsage(context: Context, prefs: SharedPreferences, megabytes: Double): UsageSyncResult? = withContext(Dispatchers.IO) {
        val tursoClient = TursoClient(context.applicationContext, prefs)
        val imei = tursoClient.ensureDeviceId(DataPlanSettings()) ?: return@withContext null
        val timestamp = Instant.now()
        
        // Calcula e envia o consumo total mensal
        val monthlyTotal = getMonthlyTotal(context, prefs)
        android.util.Log.d("BackendSyncHelper", "Enviando consumo total mensal: $monthlyTotal MB")
        
        tursoClient.sendUsage(imei, monthlyTotal, timestamp)
        
        UsageSyncResult(
            success = true,
            syncedMb = monthlyTotal,
            timestamp = timestamp
        )
    }
    
    private fun getMonthlyTotal(context: Context, prefs: SharedPreferences): Double {
        val repository = DataUsageRepository(context)
        val currentMonth = YearMonth.now(ZoneId.systemDefault())
        
        // Verifica se já sincronizou este mês
        val lastSyncMonth = prefs.getString(KEY_LAST_SYNC_MONTH, null)
        android.util.Log.d("BackendSyncHelper", "Último mês sincronizado: $lastSyncMonth")
        android.util.Log.d("BackendSyncHelper", "Mês atual: ${currentMonth.toString()}")
        
        // TEMPORÁRIO: Remover verificação para sempre enviar o valor atual
        // if (lastSyncMonth == currentMonth.toString()) {
        //     android.util.Log.d("BackendSyncHelper", "Já sincronizado este mês, retornando 0.0")
        //     return 0.0
        // }
        
        // Calcula o consumo total do mês atual
        val monthStart = currentMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli()
        val now = System.currentTimeMillis()
        
        // Usa UsageRange.CURRENT_MONTH para obter os dados do mês atual
        val totals = repository.readUsage(UsageRange.CURRENT_MONTH)
        
        val monthlyTotalMB = if (totals != null) {
            (totals.mobileRxBytes + totals.mobileTxBytes).toDouble() / (1024.0 * 1024.0)
        } else {
            0.0
        }
        
        // Log para debug
        android.util.Log.d("BackendSyncHelper", "Consumo mensal calculado: $monthlyTotalMB MB")
        android.util.Log.d("BackendSyncHelper", "Mobile Rx: ${totals?.mobileRxBytes} bytes")
        android.util.Log.d("BackendSyncHelper", "Mobile Tx: ${totals?.mobileTxBytes} bytes")
        android.util.Log.d("BackendSyncHelper", "Totals é null? ${totals == null}")
        
        // Marca que já sincronizou este mês
        prefs.edit().putString(KEY_LAST_SYNC_MONTH, currentMonth.toString()).apply()
        
        return monthlyTotalMB
    }
}
