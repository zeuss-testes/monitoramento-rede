package com.example.mobiledatamonitor

import android.app.Service
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.app.NotificationManager
import android.app.NotificationChannel
import android.content.pm.PackageManager
import androidx.core.app.NotificationCompat
import com.example.mobiledatamonitor.AppDatabase
import kotlinx.coroutines.*
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import android.app.usage.NetworkStats
import android.app.usage.NetworkStatsManager
import android.net.NetworkCapabilities
import android.telephony.TelephonyManager

class AppMonitoringService : Service() {

    private lateinit var usageStatsManager: UsageStatsManager
    private lateinit var networkStatsManager: NetworkStatsManager
    private val handler = Handler(Looper.getMainLooper())
    private val checkInterval = TimeUnit.SECONDS.toMillis(30)
    private val trackedApps = mutableMapOf<String, Long>() // packageName to accumulated time
    private lateinit var database: AppDatabase
    private val executor = Executors.newSingleThreadExecutor()
    private val coroutineScope = CoroutineScope(Dispatchers.Default)

    override fun onCreate() {
        super.onCreate()
        usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        networkStatsManager = getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
        database = AppDatabase.getInstance(this)
        startForegroundService()
        startUsageTracking()
    }

    private fun startForegroundService() {
        val notification = NotificationCompat.Builder(this, "monitoring_channel")
            .setContentTitle("App Usage Monitor")
            .setContentText("Monitoring application usage")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .build()

        startForeground(1, notification)
    }

    private fun startUsageTracking() {
        handler.postDelayed(usageCheckRunnable, checkInterval)
    }

    private val usageCheckRunnable = object : Runnable {
        override fun run() {
            executor.execute {
                checkAppUsage()
                handler.postDelayed(this, checkInterval)
            }
        }
    }

    private fun checkAppUsage() {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - checkInterval

        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime
        )

        stats?.forEach { usageStat ->
            if (usageStat.totalTimeInForeground > 0) {
                val packageName = usageStat.packageName
                val timeUsed = trackedApps.getOrDefault(packageName, 0L) + usageStat.totalTimeInForeground
                trackedApps[packageName] = timeUsed

                // Get limit from database
                coroutineScope.launch {
                    val appLimit = database.appLimitDao().getByPackage(packageName)
                    appLimit?.let {
                        if (it.isWhitelisted && timeUsed > it.timeLimit) {
                            sendTimeLimitAlert(packageName)
                        }
                    }
                }
            }
        }
        checkNetworkUsage()
    }

    private fun checkNetworkUsage() {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - checkInterval
        
        val networkStats = networkStatsManager.queryDetails(
            NetworkCapabilities.TRANSPORT_WIFI,
            "",
            startTime,
            endTime
        )
        
        try {
            val bucket = NetworkStats.Bucket()
            while (networkStats.hasNextBucket()) {
                networkStats.getNextBucket(bucket)
                val uid = bucket.uid
                val rxBytes = bucket.rxBytes
                val txBytes = bucket.txBytes
                
                if (rxBytes > 0 || txBytes > 0) {
                    val packageName = packageManager.getNameForUid(uid)
                    // Track website usage here
                }
            }
        } finally {
            networkStats.close()
        }
    }

    private fun sendTimeLimitAlert(packageName: String) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        // Create notification channel
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "limit_alerts",
                "Time Limit Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Alerts when app time limits are exceeded"
            }
            notificationManager.createNotificationChannel(channel)
        }
        
        // Build notification
        val appName = try {
            packageManager.getApplicationLabel(packageManager.getApplicationInfo(packageName, 0)) as String
        } catch (e: PackageManager.NameNotFoundException) {
            packageName
        }
        
        val notification = NotificationCompat.Builder(this, "limit_alerts")
            .setContentTitle("Tempo limite excedido")
            .setContentText("$appName ultrapassou o tempo permitido")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()
        
        notificationManager.notify(packageName.hashCode(), notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        handler.removeCallbacks(usageCheckRunnable)
        coroutineScope.cancel()
        super.onDestroy()
    }
}
