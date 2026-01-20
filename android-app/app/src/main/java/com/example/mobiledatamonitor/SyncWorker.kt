package com.example.mobiledatamonitor

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.mobiledatamonitor.data.BackendSyncHelper
import com.example.mobiledatamonitor.data.DataUsageRepository
import com.example.mobiledatamonitor.data.UsageRange
import android.util.Log

class SyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        return try {
            Log.d("SyncWorker", "Iniciando trabalho de sincronização em background")
            
            val repository = DataUsageRepository(applicationContext)
            val prefs = applicationContext.getSharedPreferences("data_monitor_prefs", Context.MODE_PRIVATE)
            
            // Obter dados de uso do mês atual
            val totals = repository.readUsage(UsageRange.CURRENT_MONTH)
            
            if (totals != null) {
                Log.d("SyncWorker", "Dados de uso encontrados: Mobile=${totals.mobileRxBytes + totals.mobileTxBytes} bytes")
                
                // Sincronizar com backend
                val result = BackendSyncHelper.syncDeltaIfNeeded(applicationContext, prefs, totals)
                
                if (result != null) {
                    Log.d("SyncWorker", "Sincronização bem-sucedida: ${result.sentMegabytes} MB enviados")
                    Result.success()
                } else {
                    Log.d("SyncWorker", "Nenhum dado para sincronizar ou sincronização não necessária")
                    Result.success()
                }
            } else {
                Log.d("SyncWorker", "Nenhum dado de uso encontrado para sincronização")
                Result.success()
            }
        } catch (e: Exception) {
            Log.e("SyncWorker", "Erro na sincronização: ${e.message}", e)
            Result.retry()
        }
    }
}
