package com.example.mobiledatamonitor.worker

import android.content.Context
import android.content.SharedPreferences
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.mobiledatamonitor.data.DataPlanSettings
import com.example.mobiledatamonitor.data.DataUsageRepository
import com.example.mobiledatamonitor.data.UsageRange
import com.example.mobiledatamonitor.data.TursoClient
import com.example.mobiledatamonitor.data.AppUsageInfo
import java.time.Instant
import com.example.mobiledatamonitor.notifications.NotificationHelper
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale

class DataUsageMonitorWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    private val repository = DataUsageRepository(context)
    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        const val WORK_NAME = "data_usage_monitor"
        private const val PREFS_NAME = "data_monitor_prefs"
        private const val KEY_LAST_PLAN_WARNING = "last_plan_warning"
        private const val KEY_LAST_PLAN_EXCEEDED = "last_plan_exceeded"
        private const val KEY_NOTIFIED_APPS_PREFIX = "notified_app_"
        private const val KEY_LAST_TOTAL_MOBILE_BYTES = "last_total_mobile_bytes"
        
        // Limites para alertas
        const val APP_HIGH_USAGE_THRESHOLD_MB = 50L // 50MB por app (mais sensível)
        const val PLAN_WARNING_PERCENTAGE = 70f // Alertar quando usar 70%
        const val PLAN_CRITICAL_PERCENTAGE = 90f // Alertar quando usar 90%
    }

    override suspend fun doWork(): Result {
        android.util.Log.d("DataUsageMonitorWorker", "Worker iniciado")
        return try {
            val client = TursoClient(applicationContext, prefs)
            val imei = client.ensureDeviceId(DataPlanSettings()) ?: return Result.success()
            
            android.util.Log.d("DataUsageMonitorWorker", "IMEI obtido: $imei")
            
            // Calcula consumo total mensal e envia
            val repository = DataUsageRepository(applicationContext)
            val totals = repository.readUsage(UsageRange.CURRENT_MONTH)
            
            val monthlyTotalMB = if (totals != null) {
                (totals.mobileRxBytes + totals.mobileTxBytes).toDouble() / (1024.0 * 1024.0)
            } else {
                0.0
            }
            
            android.util.Log.d("DataUsageMonitorWorker", "Consumo mensal: $monthlyTotalMB MB")
            android.util.Log.d("DataUsageMonitorWorker", "FIRST_RUN: ${prefs.getBoolean("FIRST_RUN", true)}")
            
            // Envia o consumo mensal atual na primeira execução ou quando tiver consumo significativo
            if (monthlyTotalMB > 0.01 || prefs.getBoolean("FIRST_RUN", true)) {
                client.sendUsage(imei, monthlyTotalMB, java.time.Instant.now())
                android.util.Log.d("DataUsageMonitorWorker", "Sincronizado consumo mensal: $monthlyTotalMB MB")
                
                // Envia consumo por app (mês atual) para dados_apps_json
                try {
                    val appsUsage = repository.getAppsUsage(UsageRange.CURRENT_MONTH)
                    val appsJson = buildAppsJson(appsUsage)
                    client.updateAppsJson(imei, appsJson)
                    android.util.Log.d("DataUsageMonitorWorker", "dados_apps_json atualizado (${appsUsage.size} apps)")
                } catch (e: Exception) {
                    android.util.Log.e("DataUsageMonitorWorker", "Erro ao enviar dados_apps_json", e)
                }

                // Marca que não é mais a primeira execução
                if (prefs.getBoolean("FIRST_RUN", true)) {
                    prefs.edit().putBoolean("FIRST_RUN", false).apply()
                    android.util.Log.d("DataUsageMonitorWorker", "Primeira execução, enviado consumo acumulado: $monthlyTotalMB MB")
                }
            } else {
                android.util.Log.d("DataUsageMonitorWorker", "Consumo muito baixo: $monthlyTotalMB MB, ignorando")
            }
            
            Result.success()
        } catch (e: Exception) {
            android.util.Log.e("DataUsageMonitorWorker", "Erro na sincronização", e)
            Result.retry()
        }
    }

    /**
     * Constrói um JSON resumido de uso por app:
     * [
     *   {"app":"YouTube","package":"com.google.android.youtube","mobile_mb":120.5,"wifi_mb":30.1,"total_mb":150.6},
     *   ...
     * ]
     */
    private fun buildAppsJson(appsUsage: List<AppUsageInfo>): String {
        val arr = JSONArray()
        appsUsage.forEach { app ->
            val mobileMb = (app.mobileTotalBytes.toDouble() / (1024.0 * 1024.0)).let { String.format(Locale.US, "%.2f", it).toDouble() }
            val wifiMb = (app.wifiTotalBytes.toDouble() / (1024.0 * 1024.0)).let { String.format(Locale.US, "%.2f", it).toDouble() }
            val totalMb = (app.totalBytes.toDouble() / (1024.0 * 1024.0)).let { String.format(Locale.US, "%.2f", it).toDouble() }

            // Só incluir apps com consumo total >= 10 MB
            if (totalMb >= 10.0) {
                val obj = JSONObject().apply {
                    put("app", app.appName)
                    put("package", app.packageName)
                    put("mobile_mb", mobileMb)
                    put("wifi_mb", wifiMb)
                    put("total_mb", totalMb)
                }
                arr.put(obj)
            }
        }
        return arr.toString()
    }

    private fun checkAppUsage() {
        val appsUsage = repository.getAppsUsage(UsageRange.TODAY)
        val thresholdBytes = APP_HIGH_USAGE_THRESHOLD_MB * 1024 * 1024

        appsUsage.forEach { app ->
            // Verificar apenas consumo de dados móveis
            if (app.mobileTotalBytes >= thresholdBytes) {
                val notifiedKey = "$KEY_NOTIFIED_APPS_PREFIX${app.packageName}_${getTodayKey()}"
                val alreadyNotified = prefs.getBoolean(notifiedKey, false)

                if (!alreadyNotified) {
                    NotificationHelper.sendHighUsageAppNotification(
                        context = applicationContext,
                        appName = app.appName,
                        usageBytes = app.mobileTotalBytes,
                        notificationId = app.uid
                    )
                    prefs.edit().putBoolean(notifiedKey, true).apply()
                }
            }
        }
    }

    private fun checkPlanUsage() {
        val settings = DataPlanSettings()
        val status = repository.getDataPlanStatus(settings)

        val todayKey = getTodayKey()

        // Verificar se excedeu o limite
        if (status.isOverLimit) {
            val lastExceededNotification = prefs.getString(KEY_LAST_PLAN_EXCEEDED, "")
            if (lastExceededNotification != todayKey) {
                NotificationHelper.sendPlanExceededNotification(applicationContext)
                prefs.edit().putString(KEY_LAST_PLAN_EXCEEDED, todayKey).apply()
            }
            return
        }

        // Verificar se está em nível crítico (90%)
        if (status.usagePercentage >= PLAN_CRITICAL_PERCENTAGE) {
            val lastWarningKey = "${KEY_LAST_PLAN_WARNING}_critical_$todayKey"
            val alreadyNotified = prefs.getBoolean(lastWarningKey, false)
            
            if (!alreadyNotified) {
                NotificationHelper.sendPlanWarningNotification(
                    context = applicationContext,
                    usagePercentage = status.usagePercentage,
                    remainingGB = status.remainingGB,
                    daysRemaining = status.daysRemainingInCycle
                )
                prefs.edit().putBoolean(lastWarningKey, true).apply()
            }
            return
        }

        // Verificar se está em nível de alerta (70%)
        if (status.usagePercentage >= PLAN_WARNING_PERCENTAGE) {
            val lastWarningKey = "${KEY_LAST_PLAN_WARNING}_warning_$todayKey"
            val alreadyNotified = prefs.getBoolean(lastWarningKey, false)
            
            if (!alreadyNotified) {
                NotificationHelper.sendPlanWarningNotification(
                    context = applicationContext,
                    usagePercentage = status.usagePercentage,
                    remainingGB = status.remainingGB,
                    daysRemaining = status.daysRemainingInCycle
                )
                prefs.edit().putBoolean(lastWarningKey, true).apply()
            }
        }
    }

    private fun getTodayKey(): String {
        val calendar = java.util.Calendar.getInstance()
        return "${calendar.get(java.util.Calendar.YEAR)}_${calendar.get(java.util.Calendar.DAY_OF_YEAR)}"
    }
}
