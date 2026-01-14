package com.example.mobiledatamonitor.notifications;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000:\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\t\n\u0002\b\u0007\n\u0002\u0010\u0007\n\u0002\b\u0003\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000e\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\rJ\u0010\u0010\u000e\u001a\u00020\u00042\u0006\u0010\u000f\u001a\u00020\u0010H\u0002J(\u0010\u0011\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\r2\u0006\u0010\u0012\u001a\u00020\u00042\u0006\u0010\u0013\u001a\u00020\u00102\b\b\u0002\u0010\u0014\u001a\u00020\u0007J\u000e\u0010\u0015\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\rJ&\u0010\u0016\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\r2\u0006\u0010\u0017\u001a\u00020\u00182\u0006\u0010\u0019\u001a\u00020\u00182\u0006\u0010\u001a\u001a\u00020\u0007R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0086T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0007X\u0086T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\u0007X\u0086T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001b"}, d2 = {"Lcom/example/mobiledatamonitor/notifications/NotificationHelper;", "", "()V", "CHANNEL_ID_HIGH_USAGE", "", "CHANNEL_ID_PLAN_LIMIT", "NOTIFICATION_ID_HIGH_USAGE_APP", "", "NOTIFICATION_ID_PLAN_EXCEEDED", "NOTIFICATION_ID_PLAN_WARNING", "createNotificationChannels", "", "context", "Landroid/content/Context;", "formatBytes", "bytes", "", "sendHighUsageAppNotification", "appName", "usageBytes", "notificationId", "sendPlanExceededNotification", "sendPlanWarningNotification", "usagePercentage", "", "remainingGB", "daysRemaining", "app_debug"})
public final class NotificationHelper {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String CHANNEL_ID_HIGH_USAGE = "high_usage_alerts";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String CHANNEL_ID_PLAN_LIMIT = "plan_limit_alerts";
    public static final int NOTIFICATION_ID_HIGH_USAGE_APP = 1001;
    public static final int NOTIFICATION_ID_PLAN_WARNING = 1002;
    public static final int NOTIFICATION_ID_PLAN_EXCEEDED = 1003;
    @org.jetbrains.annotations.NotNull()
    public static final com.example.mobiledatamonitor.notifications.NotificationHelper INSTANCE = null;
    
    private NotificationHelper() {
        super();
    }
    
    public final void createNotificationChannels(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
    }
    
    public final void sendHighUsageAppNotification(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.NotNull()
    java.lang.String appName, long usageBytes, int notificationId) {
    }
    
    public final void sendPlanWarningNotification(@org.jetbrains.annotations.NotNull()
    android.content.Context context, float usagePercentage, float remainingGB, int daysRemaining) {
    }
    
    public final void sendPlanExceededNotification(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
    }
    
    private final java.lang.String formatBytes(long bytes) {
        return null;
    }
}