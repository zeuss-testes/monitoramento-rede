package com.example.mobiledatamonitor.data;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000>\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\u0006\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u0018\u0010\b\u001a\u00020\u00072\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\fH\u0002J(\u0010\r\u001a\u0004\u0018\u00010\u000e2\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\f2\u0006\u0010\u000f\u001a\u00020\u0010H\u0086@\u00a2\u0006\u0002\u0010\u0011J(\u0010\u0012\u001a\u0004\u0018\u00010\u00132\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\f2\u0006\u0010\u0014\u001a\u00020\u0007H\u0086@\u00a2\u0006\u0002\u0010\u0015R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0016"}, d2 = {"Lcom/example/mobiledatamonitor/data/BackendSyncHelper;", "", "()V", "KEY_LAST_SYNC_MONTH", "", "KEY_LAST_TOTAL_MOBILE_BYTES", "MIN_DELTA_MB", "", "getMonthlyTotal", "context", "Landroid/content/Context;", "prefs", "Landroid/content/SharedPreferences;", "syncDeltaIfNeeded", "Lcom/example/mobiledatamonitor/data/UsageDeltaResult;", "totals", "Lcom/example/mobiledatamonitor/data/UsageTotals;", "(Landroid/content/Context;Landroid/content/SharedPreferences;Lcom/example/mobiledatamonitor/data/UsageTotals;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "syncUsage", "Lcom/example/mobiledatamonitor/data/UsageSyncResult;", "megabytes", "(Landroid/content/Context;Landroid/content/SharedPreferences;DLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public final class BackendSyncHelper {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_LAST_TOTAL_MOBILE_BYTES = "last_total_mobile_bytes";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_LAST_SYNC_MONTH = "last_sync_month";
    private static final double MIN_DELTA_MB = 0.1;
    @org.jetbrains.annotations.NotNull()
    public static final com.example.mobiledatamonitor.data.BackendSyncHelper INSTANCE = null;
    
    private BackendSyncHelper() {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object syncDeltaIfNeeded(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.NotNull()
    android.content.SharedPreferences prefs, @org.jetbrains.annotations.NotNull()
    com.example.mobiledatamonitor.data.UsageTotals totals, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.example.mobiledatamonitor.data.UsageDeltaResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object syncUsage(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.NotNull()
    android.content.SharedPreferences prefs, double megabytes, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.example.mobiledatamonitor.data.UsageSyncResult> $completion) {
        return null;
    }
    
    private final double getMonthlyTotal(android.content.Context context, android.content.SharedPreferences prefs) {
        return 0.0;
    }
}