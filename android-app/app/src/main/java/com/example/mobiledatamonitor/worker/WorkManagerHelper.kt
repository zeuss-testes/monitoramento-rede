package com.example.mobiledatamonitor.worker

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkRequest
import java.util.concurrent.TimeUnit

object WorkManagerHelper {

    fun scheduleDataUsageMonitoring(context: Context) {
        android.util.Log.d("WorkManagerHelper", "scheduleDataUsageMonitoring iniciado")
        
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .setRequiresBatteryNotLow(false) // Executar mesmo com bateria baixa
            .build()

        // Executar a cada 15 minutos (mínimo permitido pelo WorkManager)
        val workRequest = PeriodicWorkRequestBuilder<DataUsageMonitorWorker>(
            15, TimeUnit.MINUTES
        )
            .setConstraints(constraints)
            .setBackoffCriteria(
                androidx.work.BackoffPolicy.EXPONENTIAL,
                WorkRequest.MIN_BACKOFF_MILLIS,
                TimeUnit.MILLISECONDS
            )
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            DataUsageMonitorWorker.WORK_NAME,
            ExistingPeriodicWorkPolicy.UPDATE, // Atualiza se já existir
            workRequest
        )
        
        android.util.Log.d("WorkManagerHelper", "WorkManager enfileirado com sucesso")
    }

    fun cancelDataUsageMonitoring(context: Context) {
        WorkManager.getInstance(context).cancelUniqueWork(DataUsageMonitorWorker.WORK_NAME)
    }
}
