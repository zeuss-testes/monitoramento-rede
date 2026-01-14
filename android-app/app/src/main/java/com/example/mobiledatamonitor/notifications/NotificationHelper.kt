package com.example.mobiledatamonitor.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.example.mobiledatamonitor.MainActivity
import com.example.mobiledatamonitor.R

object NotificationHelper {

    private const val CHANNEL_ID_HIGH_USAGE = "high_usage_alerts"
    private const val CHANNEL_ID_PLAN_LIMIT = "plan_limit_alerts"
    
    const val NOTIFICATION_ID_HIGH_USAGE_APP = 1001
    const val NOTIFICATION_ID_PLAN_WARNING = 1002
    const val NOTIFICATION_ID_PLAN_EXCEEDED = 1003

    fun createNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = context.getSystemService(NotificationManager::class.java)

            // Canal para alertas de alto consumo por app
            val highUsageChannel = NotificationChannel(
                CHANNEL_ID_HIGH_USAGE,
                "Alertas de Alto Consumo",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notificações quando um app consome muitos dados"
                enableVibration(true)
            }

            // Canal para alertas do plano de dados
            val planLimitChannel = NotificationChannel(
                CHANNEL_ID_PLAN_LIMIT,
                "Alertas do Plano de Dados",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notificações sobre o limite do seu plano de dados"
                enableVibration(true)
            }

            notificationManager.createNotificationChannel(highUsageChannel)
            notificationManager.createNotificationChannel(planLimitChannel)
        }
    }

    fun sendHighUsageAppNotification(
        context: Context,
        appName: String,
        usageBytes: Long,
        notificationId: Int = NOTIFICATION_ID_HIGH_USAGE_APP
    ) {
        val usageFormatted = formatBytes(usageBytes)
        
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID_HIGH_USAGE)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("⚠️ Alto consumo de dados!")
            .setContentText("$appName já consumiu $usageFormatted")
            .setStyle(NotificationCompat.BigTextStyle()
                .bigText("O app $appName já consumiu $usageFormatted de dados móveis. Considere usar Wi-Fi ou limitar o uso em segundo plano."))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(notificationId, notification)
        } catch (e: SecurityException) {
            // Permissão de notificação não concedida
        }
    }

    fun sendPlanWarningNotification(
        context: Context,
        usagePercentage: Float,
        remainingGB: Float,
        daysRemaining: Int
    ) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID_PLAN_LIMIT)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("📊 Atenção ao seu plano de dados!")
            .setContentText("Você já usou ${usagePercentage.toInt()}% do seu plano")
            .setStyle(NotificationCompat.BigTextStyle()
                .bigText("Você já usou ${usagePercentage.toInt()}% do seu plano. Restam apenas %.2f GB para os próximos $daysRemaining dias.".format(remainingGB)))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_PLAN_WARNING, notification)
        } catch (e: SecurityException) {
            // Permissão de notificação não concedida
        }
    }

    fun sendPlanExceededNotification(context: Context) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID_PLAN_LIMIT)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("🚨 Limite de dados excedido!")
            .setContentText("Você ultrapassou o limite de 7GB do seu plano")
            .setStyle(NotificationCompat.BigTextStyle()
                .bigText("Você ultrapassou o limite de 7GB do seu plano de dados móveis. Sua internet pode ficar mais lenta ou você pode ter cobranças adicionais."))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID_PLAN_EXCEEDED, notification)
        } catch (e: SecurityException) {
            // Permissão de notificação não concedida
        }
    }

    private fun formatBytes(bytes: Long): String {
        return when {
            bytes >= 1024 * 1024 * 1024 -> "%.2f GB".format(bytes / (1024.0 * 1024.0 * 1024.0))
            bytes >= 1024 * 1024 -> "%.1f MB".format(bytes / (1024.0 * 1024.0))
            bytes >= 1024 -> "%.0f KB".format(bytes / 1024.0)
            else -> "$bytes B"
        }
    }
}
