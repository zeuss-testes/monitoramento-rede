package com.example.mobiledatamonitor.data

import android.app.usage.NetworkStats
import android.app.usage.NetworkStatsManager
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import java.util.Calendar

class DataUsageRepository(context: Context) {

    private val appContext = context.applicationContext
    private val networkStatsManager: NetworkStatsManager? =
        appContext.getSystemService(NetworkStatsManager::class.java)
    private val packageManager: PackageManager = appContext.packageManager

    fun readUsage(range: UsageRange): UsageTotals? {
        val manager = networkStatsManager ?: return null
        val end = System.currentTimeMillis()
        val start = range.computeStartTimestamp(end)

        return try {
            val (mobileRx, mobileTx) = manager.collectBytes(ConnectivityManager.TYPE_MOBILE, start, end)
            val (wifiRx, wifiTx) = manager.collectBytes(ConnectivityManager.TYPE_WIFI, start, end)

            UsageTotals(
                mobileRxBytes = mobileRx,
                mobileTxBytes = mobileTx,
                wifiRxBytes = wifiRx,
                wifiTxBytes = wifiTx,
                startTimeMillis = start,
                endTimeMillis = end
            )
        } catch (security: SecurityException) {
            throw security
        } catch (illegal: IllegalArgumentException) {
            null
        }
    }

    fun getAppsUsage(range: UsageRange): List<AppUsageInfo> {
        val manager = networkStatsManager ?: return emptyList()
        val end = System.currentTimeMillis()
        val start = range.computeStartTimestamp(end)

        val appsUsageMap = mutableMapOf<Int, AppUsageData>()

        try {
            // Coletar dados móveis por UID
            collectAppBytes(manager, ConnectivityManager.TYPE_MOBILE, start, end, appsUsageMap, isMobile = true)
            // Coletar dados Wi-Fi por UID
            collectAppBytes(manager, ConnectivityManager.TYPE_WIFI, start, end, appsUsageMap, isMobile = false)
        } catch (e: Exception) {
            return emptyList()
        }

        // Converter para lista de AppUsageInfo
        return appsUsageMap.mapNotNull { (uid, data) ->
            getAppInfoForUid(uid, data)
        }.sortedByDescending { it.totalBytes }
    }

    fun getDataPlanStatus(settings: DataPlanSettings): DataPlanStatus {
        val manager = networkStatsManager ?: return createEmptyStatus(settings)
        
        // Calcular início do ciclo de faturamento
        val cycleStart = getCycleStartTimestamp(settings.billingCycleStartDay)
        val now = System.currentTimeMillis()

        return try {
            val (mobileRx, mobileTx) = manager.collectBytes(ConnectivityManager.TYPE_MOBILE, cycleStart, now)
            val usedBytes = mobileRx + mobileTx
            val remainingBytes = (settings.monthlyLimitBytes - usedBytes).coerceAtLeast(0)
            val usagePercentage = (usedBytes.toFloat() / settings.monthlyLimitBytes * 100).coerceIn(0f, 100f)
            
            // Calcular dias restantes no ciclo
            val daysInCycle = getDaysInCurrentCycle(settings.billingCycleStartDay)
            val daysElapsed = getDaysElapsedInCycle(settings.billingCycleStartDay)
            val daysRemaining = (daysInCycle - daysElapsed).coerceAtLeast(0)
            
            // Calcular média diária e projeção
            val averageDailyUsage = if (daysElapsed > 0) usedBytes / daysElapsed else 0L
            val projectedUsage = usedBytes + (averageDailyUsage * daysRemaining)

            DataPlanStatus(
                usedBytes = usedBytes,
                limitBytes = settings.monthlyLimitBytes,
                remainingBytes = remainingBytes,
                usagePercentage = usagePercentage,
                daysRemainingInCycle = daysRemaining,
                averageDailyUsage = averageDailyUsage,
                projectedUsageAtEndOfCycle = projectedUsage,
                isOverLimit = usedBytes >= settings.monthlyLimitBytes
            )
        } catch (e: Exception) {
            createEmptyStatus(settings)
        }
    }

    private fun createEmptyStatus(settings: DataPlanSettings): DataPlanStatus {
        return DataPlanStatus(
            usedBytes = 0,
            limitBytes = settings.monthlyLimitBytes,
            remainingBytes = settings.monthlyLimitBytes,
            usagePercentage = 0f,
            daysRemainingInCycle = getDaysInCurrentCycle(settings.billingCycleStartDay),
            averageDailyUsage = 0,
            projectedUsageAtEndOfCycle = 0,
            isOverLimit = false
        )
    }

    private fun getCycleStartTimestamp(startDay: Int): Long {
        val calendar = Calendar.getInstance()
        val currentDay = calendar.get(Calendar.DAY_OF_MONTH)
        
        if (currentDay < startDay) {
            // Voltar para o mês anterior
            calendar.add(Calendar.MONTH, -1)
        }
        
        calendar.set(Calendar.DAY_OF_MONTH, startDay.coerceAtMost(calendar.getActualMaximum(Calendar.DAY_OF_MONTH)))
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        
        return calendar.timeInMillis
    }

    private fun getDaysInCurrentCycle(startDay: Int): Int {
        val calendar = Calendar.getInstance()
        return calendar.getActualMaximum(Calendar.DAY_OF_MONTH)
    }

    private fun getDaysElapsedInCycle(startDay: Int): Int {
        val cycleStart = getCycleStartTimestamp(startDay)
        val now = System.currentTimeMillis()
        val diffMillis = now - cycleStart
        return (diffMillis / (24 * 60 * 60 * 1000)).toInt().coerceAtLeast(1)
    }

    private fun collectAppBytes(
        manager: NetworkStatsManager,
        networkType: Int,
        start: Long,
        end: Long,
        appsUsageMap: MutableMap<Int, AppUsageData>,
        isMobile: Boolean
    ) {
        try {
            val stats = manager.querySummary(networkType, null, start, end)
            val bucket = NetworkStats.Bucket()
            
            while (stats.hasNextBucket()) {
                stats.getNextBucket(bucket)
                val uid = bucket.uid
                
                // Incluir todos os UIDs válidos (>= 0), incluindo apps do sistema
                if (uid < 0) continue
                
                // Ignorar apenas se não tiver consumo
                if (bucket.rxBytes == 0L && bucket.txBytes == 0L) continue
                
                val existing = appsUsageMap.getOrPut(uid) { AppUsageData() }
                
                if (isMobile) {
                    existing.mobileRx += bucket.rxBytes
                    existing.mobileTx += bucket.txBytes
                } else {
                    existing.wifiRx += bucket.rxBytes
                    existing.wifiTx += bucket.txBytes
                }
            }
            stats.close()
        } catch (e: SecurityException) {
            // Permissão não concedida - logar para debug
            android.util.Log.e("DataUsageRepo", "SecurityException ao coletar dados: ${e.message}")
        } catch (e: Exception) {
            android.util.Log.e("DataUsageRepo", "Erro ao coletar dados: ${e.message}")
        }
    }

    private fun getAppInfoForUid(uid: Int, data: AppUsageData): AppUsageInfo? {
        return try {
            val packages = packageManager.getPackagesForUid(uid)
            
            // Se não encontrar pacote, criar entrada genérica para UID do sistema
            if (packages.isNullOrEmpty()) {
                // Criar entrada para UIDs conhecidos do sistema
                val systemName = when (uid) {
                    0 -> "Sistema (root)"
                    1000 -> "Sistema Android"
                    else -> "UID $uid"
                }
                return AppUsageInfo(
                    packageName = "android.uid.$uid",
                    appName = systemName,
                    appIcon = null,
                    mobileRxBytes = data.mobileRx,
                    mobileTxBytes = data.mobileTx,
                    wifiRxBytes = data.wifiRx,
                    wifiTxBytes = data.wifiTx,
                    uid = uid
                )
            }
            
            val packageName = packages[0]
            val appInfo = try {
                packageManager.getApplicationInfo(packageName, 0)
            } catch (e: Exception) {
                null
            }
            
            val appName = if (appInfo != null) {
                packageManager.getApplicationLabel(appInfo).toString()
            } else {
                packageName.substringAfterLast(".")
            }
            
            val appIcon = try {
                packageManager.getApplicationIcon(packageName)
            } catch (e: Exception) {
                null
            }

            AppUsageInfo(
                packageName = packageName,
                appName = appName,
                appIcon = appIcon,
                mobileRxBytes = data.mobileRx,
                mobileTxBytes = data.mobileTx,
                wifiRxBytes = data.wifiRx,
                wifiTxBytes = data.wifiTx,
                uid = uid
            )
        } catch (e: Exception) {
            android.util.Log.e("DataUsageRepo", "Erro ao obter info do app UID $uid: ${e.message}")
            null
        }
    }

    private fun NetworkStatsManager.collectBytes(
        networkType: Int,
        start: Long,
        end: Long
    ): Pair<Long, Long> {
        return try {
            val bucket = querySummaryForDevice(networkType, null, start, end)
            bucket.rxBytes to bucket.txBytes
        } catch (e: Exception) {
            0L to 0L
        }
    }

    private data class AppUsageData(
        var mobileRx: Long = 0,
        var mobileTx: Long = 0,
        var wifiRx: Long = 0,
        var wifiTx: Long = 0
    )
}
