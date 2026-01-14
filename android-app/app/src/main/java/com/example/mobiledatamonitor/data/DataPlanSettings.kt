package com.example.mobiledatamonitor.data

data class DataPlanSettings(
    val monthlyLimitBytes: Long = 7L * 1024 * 1024 * 1024, // 7GB padrão
    val billingCycleStartDay: Int = 1 // Dia do mês que o ciclo começa
) {
    companion object {
        const val BYTES_PER_GB = 1024L * 1024L * 1024L
        const val BYTES_PER_MB = 1024L * 1024L
    }
}

data class DataPlanStatus(
    val usedBytes: Long,
    val limitBytes: Long,
    val remainingBytes: Long,
    val usagePercentage: Float,
    val daysRemainingInCycle: Int,
    val averageDailyUsage: Long,
    val projectedUsageAtEndOfCycle: Long,
    val isOverLimit: Boolean
) {
    val remainingGB: Float get() = remainingBytes.toFloat() / DataPlanSettings.BYTES_PER_GB
    val usedGB: Float get() = usedBytes.toFloat() / DataPlanSettings.BYTES_PER_GB
    val limitGB: Float get() = limitBytes.toFloat() / DataPlanSettings.BYTES_PER_GB
}
