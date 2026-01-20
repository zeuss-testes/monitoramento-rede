package com.example.mobiledatamonitor;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000v\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0002\b\u0003\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\b\u0010\u001d\u001a\u00020\u001eH\u0002J\b\u0010\u001f\u001a\u00020\u001eH\u0002J\b\u0010 \u001a\u00020\u001eH\u0002J\b\u0010!\u001a\u00020\u001eH\u0014J\u000e\u0010\"\u001a\u00020\u001e2\u0006\u0010#\u001a\u00020$J\u000e\u0010%\u001a\u00020\u001e2\u0006\u0010&\u001a\u00020\'J\b\u0010(\u001a\u00020\u001eH\u0002J\u0006\u0010)\u001a\u00020\u001eJ\u0010\u0010*\u001a\u00020\u001e2\b\b\u0002\u0010+\u001a\u00020,J\b\u0010-\u001a\u00020\u001eH\u0002J\b\u0010.\u001a\u00020\u001eH\u0002R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082D\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0016\u0010\n\u001a\n \f*\u0004\u0018\u00010\u000b0\u000bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010\r\u001a\u0004\u0018\u00010\u000eX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000f\u001a\u00020\u0010X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0016\u0010\u0011\u001a\n \f*\u0004\u0018\u00010\u00120\u0012X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0013\u001a\u00020\u0014X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\u0015\u001a\b\u0012\u0004\u0012\u00020\t0\u0016\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0017\u0010\u0018R\u000e\u0010\u0019\u001a\u00020\u001aX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u001b\u001a\u00020\u001cX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006/"}, d2 = {"Lcom/example/mobiledatamonitor/UsageMonitorViewModel;", "Landroidx/lifecycle/AndroidViewModel;", "application", "Landroid/app/Application;", "(Landroid/app/Application;)V", "PREF_SAVED_LIMIT", "", "_state", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/example/mobiledatamonitor/UsageMonitorState;", "appContext", "Landroid/content/Context;", "kotlin.jvm.PlatformType", "autoRefreshJob", "Lkotlinx/coroutines/Job;", "backendClient", "Lcom/example/mobiledatamonitor/data/BackendClient;", "prefs", "Landroid/content/SharedPreferences;", "repository", "Lcom/example/mobiledatamonitor/data/DataUsageRepository;", "state", "Lkotlinx/coroutines/flow/StateFlow;", "getState", "()Lkotlinx/coroutines/flow/StateFlow;", "tursoClient", "Lcom/example/mobiledatamonitor/data/TursoClient;", "userManager", "Lcom/example/mobiledatamonitor/data/UserManager;", "loadDataLimitFromBackend", "", "loadEmployeeProfile", "loadSavedLimit", "onCleared", "onRangeSelected", "range", "Lcom/example/mobiledatamonitor/data/UsageRange;", "onTabSelected", "tabIndex", "", "refreshDataPlanStatus", "refreshPermissions", "refreshUsage", "force", "", "registerDeviceWithBackend", "scheduleAutoRefresh", "app_debug"})
public final class UsageMonitorViewModel extends androidx.lifecycle.AndroidViewModel {
    private final android.content.Context appContext = null;
    @org.jetbrains.annotations.NotNull()
    private final com.example.mobiledatamonitor.data.DataUsageRepository repository = null;
    private final android.content.SharedPreferences prefs = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String PREF_SAVED_LIMIT = "pref_monthly_limit_bytes";
    @org.jetbrains.annotations.NotNull()
    private final com.example.mobiledatamonitor.data.TursoClient tursoClient = null;
    @org.jetbrains.annotations.NotNull()
    private final com.example.mobiledatamonitor.data.BackendClient backendClient = null;
    @org.jetbrains.annotations.NotNull()
    private final com.example.mobiledatamonitor.data.UserManager userManager = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.example.mobiledatamonitor.UsageMonitorState> _state = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.example.mobiledatamonitor.UsageMonitorState> state = null;
    @org.jetbrains.annotations.Nullable()
    private kotlinx.coroutines.Job autoRefreshJob;
    
    public UsageMonitorViewModel(@org.jetbrains.annotations.NotNull()
    android.app.Application application) {
        super(null);
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.example.mobiledatamonitor.UsageMonitorState> getState() {
        return null;
    }
    
    private final void loadSavedLimit() {
    }
    
    private final void loadDataLimitFromBackend() {
    }
    
    public final void onRangeSelected(@org.jetbrains.annotations.NotNull()
    com.example.mobiledatamonitor.data.UsageRange range) {
    }
    
    public final void onTabSelected(int tabIndex) {
    }
    
    public final void refreshUsage(boolean force) {
    }
    
    private final void registerDeviceWithBackend() {
    }
    
    private final void loadEmployeeProfile() {
    }
    
    private final void refreshDataPlanStatus() {
    }
    
    public final void refreshPermissions() {
    }
    
    private final void scheduleAutoRefresh() {
    }
    
    @java.lang.Override()
    protected void onCleared() {
    }
}