package com.example.mobiledatamonitor;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000z\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\t\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010%\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\t\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\b\u0010\u001e\u001a\u00020\u001fH\u0002J\b\u0010 \u001a\u00020\u001fH\u0002J\u0014\u0010!\u001a\u0004\u0018\u00010\"2\b\u0010#\u001a\u0004\u0018\u00010$H\u0016J\b\u0010%\u001a\u00020\u001fH\u0016J\b\u0010&\u001a\u00020\u001fH\u0016J\"\u0010\'\u001a\u00020(2\b\u0010#\u001a\u0004\u0018\u00010$2\u0006\u0010)\u001a\u00020(2\u0006\u0010*\u001a\u00020(H\u0016J\u0010\u0010+\u001a\u00020\u001f2\u0006\u0010,\u001a\u00020\u001aH\u0002J\b\u0010-\u001a\u00020\u001fH\u0002J\b\u0010.\u001a\u00020\u001fH\u0002J\b\u0010/\u001a\u00020\u001fH\u0002J\b\u00100\u001a\u00020\u001fH\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082.\u00a2\u0006\u0002\n\u0000R\u0016\u0010\u000b\u001a\n \r*\u0004\u0018\u00010\f0\fX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000e\u001a\u00020\u000fX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0010\u001a\u00020\u0011X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0012\u001a\u00020\u0013X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0014\u001a\u00020\u0004X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0012\u0010\u0015\u001a\u00060\u0016j\u0002`\u0017X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u001a\u0010\u0018\u001a\u000e\u0012\u0004\u0012\u00020\u001a\u0012\u0004\u0012\u00020\u00040\u0019X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0012\u0010\u001b\u001a\u00060\u0016j\u0002`\u0017X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u001c\u001a\u00020\u001dX\u0082.\u00a2\u0006\u0002\n\u0000\u00a8\u00061"}, d2 = {"Lcom/example/mobiledatamonitor/AppMonitoringService;", "Landroid/app/Service;", "()V", "checkInterval", "", "coroutineScope", "Lkotlinx/coroutines/CoroutineScope;", "dataRepository", "Lcom/example/mobiledatamonitor/data/DataUsageRepository;", "database", "Lcom/example/mobiledatamonitor/AppDatabase;", "executor", "Ljava/util/concurrent/ExecutorService;", "kotlin.jvm.PlatformType", "handler", "Landroid/os/Handler;", "networkStatsManager", "Landroid/app/usage/NetworkStatsManager;", "prefs", "Landroid/content/SharedPreferences;", "syncInterval", "syncRunnable", "Ljava/lang/Runnable;", "Lkotlinx/coroutines/Runnable;", "trackedApps", "", "", "usageCheckRunnable", "usageStatsManager", "Landroid/app/usage/UsageStatsManager;", "checkAppUsage", "", "checkNetworkUsage", "onBind", "Landroid/os/IBinder;", "intent", "Landroid/content/Intent;", "onCreate", "onDestroy", "onStartCommand", "", "flags", "startId", "sendTimeLimitAlert", "packageName", "startForegroundService", "startPeriodicSync", "startUsageTracking", "syncDataWithBackend", "app_debug"})
public final class AppMonitoringService extends android.app.Service {
    private android.app.usage.UsageStatsManager usageStatsManager;
    private android.app.usage.NetworkStatsManager networkStatsManager;
    @org.jetbrains.annotations.NotNull()
    private final android.os.Handler handler = null;
    private final long checkInterval = 0L;
    private final long syncInterval = 0L;
    @org.jetbrains.annotations.NotNull()
    private final java.util.Map<java.lang.String, java.lang.Long> trackedApps = null;
    private com.example.mobiledatamonitor.AppDatabase database;
    private com.example.mobiledatamonitor.data.DataUsageRepository dataRepository;
    private android.content.SharedPreferences prefs;
    private final java.util.concurrent.ExecutorService executor = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.CoroutineScope coroutineScope = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.Runnable usageCheckRunnable = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.Runnable syncRunnable = null;
    
    public AppMonitoringService() {
        super();
    }
    
    @java.lang.Override()
    public void onCreate() {
    }
    
    private final void startForegroundService() {
    }
    
    private final void startUsageTracking() {
    }
    
    private final void startPeriodicSync() {
    }
    
    private final void checkAppUsage() {
    }
    
    private final void syncDataWithBackend() {
    }
    
    private final void checkNetworkUsage() {
    }
    
    private final void sendTimeLimitAlert(java.lang.String packageName) {
    }
    
    @java.lang.Override()
    public int onStartCommand(@org.jetbrains.annotations.Nullable()
    android.content.Intent intent, int flags, int startId) {
        return 0;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public android.os.IBinder onBind(@org.jetbrains.annotations.Nullable()
    android.content.Intent intent) {
        return null;
    }
    
    @java.lang.Override()
    public void onDestroy() {
    }
}