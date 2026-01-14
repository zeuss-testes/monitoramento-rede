package com.example.mobiledatamonitor.data;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000b\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010 \n\u0002\b\u0004\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0010\u0006\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0002\b\u0004\u0018\u0000 %2\u00020\u0001:\u0001%B\u0015\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0018\u0010\t\u001a\u0004\u0018\u00010\n2\u0006\u0010\u000b\u001a\u00020\fH\u0086@\u00a2\u0006\u0002\u0010\rJ(\u0010\u000e\u001a\u0004\u0018\u00010\u000f2\u0006\u0010\u0010\u001a\u00020\n2\u000e\u0010\u0011\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\n0\u0012H\u0082@\u00a2\u0006\u0002\u0010\u0013J\u0012\u0010\u0014\u001a\u00020\n2\b\u0010\u0015\u001a\u0004\u0018\u00010\nH\u0002J&\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00020\n2\u0006\u0010\u0019\u001a\u00020\u001a2\u0006\u0010\u001b\u001a\u00020\u001cH\u0086@\u00a2\u0006\u0002\u0010\u001dJ\u000e\u0010\u001e\u001a\u00020\u001fH\u0086@\u00a2\u0006\u0002\u0010 J\u001e\u0010!\u001a\u00020\"2\u0006\u0010\u0018\u001a\u00020\n2\u0006\u0010#\u001a\u00020\nH\u0086@\u00a2\u0006\u0002\u0010$R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006&"}, d2 = {"Lcom/example/mobiledatamonitor/data/TursoClient;", "", "context", "Landroid/content/Context;", "prefs", "Landroid/content/SharedPreferences;", "(Landroid/content/Context;Landroid/content/SharedPreferences;)V", "userManager", "Lcom/example/mobiledatamonitor/data/UserManager;", "ensureDeviceId", "", "settings", "Lcom/example/mobiledatamonitor/data/DataPlanSettings;", "(Lcom/example/mobiledatamonitor/data/DataPlanSettings;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "executeSQL", "Lorg/json/JSONObject;", "sql", "params", "", "(Ljava/lang/String;Ljava/util/List;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getRealImei", "customImei", "sendUsage", "", "imei", "megabytes", "", "recordedAt", "Ljava/time/Instant;", "(Ljava/lang/String;DLjava/time/Instant;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "testConnection", "", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "updateAppsJson", "", "appsJson", "(Ljava/lang/String;Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "Companion", "app_debug"})
public final class TursoClient {
    @org.jetbrains.annotations.NotNull()
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull()
    private final android.content.SharedPreferences prefs = null;
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String PREF_DEVICE_ID = "turso_device_id";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "TursoClient";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TURSO_URL = "https://rede-scan-zeuss.aws-us-east-1.turso.io/v2/pipeline";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjgyMjU3NjUsImlkIjoiNTc0N2ZmMjctNmMwNS00MmQzLWE4NjMtMDUzYTg3MzljMjk5IiwicmlkIjoiYWU3NWJlYzYtMGUxYy00OGY1LWI5ZjAtM2M4MjljODBhNzY1In0.PJPf3Ed339gD1EeqWm3C0_c0qwnKHv5elOcAjBNAC-Lkt1_I-nRTRzytlI9Rc0Yws6GZG1xwKKJFJ1J91NmFCg";
    @org.jetbrains.annotations.NotNull()
    private final com.example.mobiledatamonitor.data.UserManager userManager = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.example.mobiledatamonitor.data.TursoClient.Companion Companion = null;
    
    public TursoClient(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.NotNull()
    android.content.SharedPreferences prefs) {
        super();
    }
    
    private final java.lang.String getRealImei(java.lang.String customImei) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object ensureDeviceId(@org.jetbrains.annotations.NotNull()
    com.example.mobiledatamonitor.data.DataPlanSettings settings, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.lang.String> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object sendUsage(@org.jetbrains.annotations.NotNull()
    java.lang.String imei, double megabytes, @org.jetbrains.annotations.NotNull()
    java.time.Instant recordedAt, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.lang.Integer> $completion) {
        return null;
    }
    
    /**
     * Atualiza a coluna dados_apps_json com JSON de uso por app (mês atual).
     */
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object updateAppsJson(@org.jetbrains.annotations.NotNull()
    java.lang.String imei, @org.jetbrains.annotations.NotNull()
    java.lang.String appsJson, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    private final java.lang.Object executeSQL(java.lang.String sql, java.util.List<java.lang.String> params, kotlin.coroutines.Continuation<? super org.json.JSONObject> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object testConnection(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.lang.Boolean> $completion) {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0014\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0004\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\b"}, d2 = {"Lcom/example/mobiledatamonitor/data/TursoClient$Companion;", "", "()V", "PREF_DEVICE_ID", "", "TAG", "TURSO_AUTH_TOKEN", "TURSO_URL", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}