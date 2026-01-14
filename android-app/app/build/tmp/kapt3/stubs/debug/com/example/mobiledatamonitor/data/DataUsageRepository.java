package com.example.mobiledatamonitor.data;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000t\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0010%\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010 \n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\u0018\u00002\u00020\u0001:\u0001-B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004JD\u0010\u000b\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\b2\u0006\u0010\u000e\u001a\u00020\u000f2\u0006\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u00112\u0012\u0010\u0013\u001a\u000e\u0012\u0004\u0012\u00020\u000f\u0012\u0004\u0012\u00020\u00150\u00142\u0006\u0010\u0016\u001a\u00020\u0017H\u0002J\u0010\u0010\u0018\u001a\u00020\u00192\u0006\u0010\u001a\u001a\u00020\u001bH\u0002J\u001a\u0010\u001c\u001a\u0004\u0018\u00010\u001d2\u0006\u0010\u001e\u001a\u00020\u000f2\u0006\u0010\u001f\u001a\u00020\u0015H\u0002J\u0014\u0010 \u001a\b\u0012\u0004\u0012\u00020\u001d0!2\u0006\u0010\"\u001a\u00020#J\u0010\u0010$\u001a\u00020\u00112\u0006\u0010%\u001a\u00020\u000fH\u0002J\u000e\u0010&\u001a\u00020\u00192\u0006\u0010\u001a\u001a\u00020\u001bJ\u0010\u0010\'\u001a\u00020\u000f2\u0006\u0010%\u001a\u00020\u000fH\u0002J\u0010\u0010(\u001a\u00020\u000f2\u0006\u0010%\u001a\u00020\u000fH\u0002J\u0010\u0010)\u001a\u0004\u0018\u00010*2\u0006\u0010\"\u001a\u00020#J0\u0010+\u001a\u000e\u0012\u0004\u0012\u00020\u0011\u0012\u0004\u0012\u00020\u00110,*\u00020\b2\u0006\u0010\u000e\u001a\u00020\u000f2\u0006\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0011H\u0002R\u0016\u0010\u0005\u001a\n \u0006*\u0004\u0018\u00010\u00030\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u0007\u001a\u0004\u0018\u00010\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006."}, d2 = {"Lcom/example/mobiledatamonitor/data/DataUsageRepository;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "appContext", "kotlin.jvm.PlatformType", "networkStatsManager", "Landroid/app/usage/NetworkStatsManager;", "packageManager", "Landroid/content/pm/PackageManager;", "collectAppBytes", "", "manager", "networkType", "", "start", "", "end", "appsUsageMap", "", "Lcom/example/mobiledatamonitor/data/DataUsageRepository$AppUsageData;", "isMobile", "", "createEmptyStatus", "Lcom/example/mobiledatamonitor/data/DataPlanStatus;", "settings", "Lcom/example/mobiledatamonitor/data/DataPlanSettings;", "getAppInfoForUid", "Lcom/example/mobiledatamonitor/data/AppUsageInfo;", "uid", "data", "getAppsUsage", "", "range", "Lcom/example/mobiledatamonitor/data/UsageRange;", "getCycleStartTimestamp", "startDay", "getDataPlanStatus", "getDaysElapsedInCycle", "getDaysInCurrentCycle", "readUsage", "Lcom/example/mobiledatamonitor/data/UsageTotals;", "collectBytes", "Lkotlin/Pair;", "AppUsageData", "app_debug"})
public final class DataUsageRepository {
    private final android.content.Context appContext = null;
    @org.jetbrains.annotations.Nullable()
    private final android.app.usage.NetworkStatsManager networkStatsManager = null;
    @org.jetbrains.annotations.NotNull()
    private final android.content.pm.PackageManager packageManager = null;
    
    public DataUsageRepository(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.example.mobiledatamonitor.data.UsageTotals readUsage(@org.jetbrains.annotations.NotNull()
    com.example.mobiledatamonitor.data.UsageRange range) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.example.mobiledatamonitor.data.AppUsageInfo> getAppsUsage(@org.jetbrains.annotations.NotNull()
    com.example.mobiledatamonitor.data.UsageRange range) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.example.mobiledatamonitor.data.DataPlanStatus getDataPlanStatus(@org.jetbrains.annotations.NotNull()
    com.example.mobiledatamonitor.data.DataPlanSettings settings) {
        return null;
    }
    
    private final com.example.mobiledatamonitor.data.DataPlanStatus createEmptyStatus(com.example.mobiledatamonitor.data.DataPlanSettings settings) {
        return null;
    }
    
    private final long getCycleStartTimestamp(int startDay) {
        return 0L;
    }
    
    private final int getDaysInCurrentCycle(int startDay) {
        return 0;
    }
    
    private final int getDaysElapsedInCycle(int startDay) {
        return 0;
    }
    
    private final void collectAppBytes(android.app.usage.NetworkStatsManager manager, int networkType, long start, long end, java.util.Map<java.lang.Integer, com.example.mobiledatamonitor.data.DataUsageRepository.AppUsageData> appsUsageMap, boolean isMobile) {
    }
    
    private final com.example.mobiledatamonitor.data.AppUsageInfo getAppInfoForUid(int uid, com.example.mobiledatamonitor.data.DataUsageRepository.AppUsageData data) {
        return null;
    }
    
    private final kotlin.Pair<java.lang.Long, java.lang.Long> collectBytes(android.app.usage.NetworkStatsManager $this$collectBytes, int networkType, long start, long end) {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\t\n\u0002\b\u0014\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0000\b\u0082\b\u0018\u00002\u00020\u0001B-\u0012\b\b\u0002\u0010\u0002\u001a\u00020\u0003\u0012\b\b\u0002\u0010\u0004\u001a\u00020\u0003\u0012\b\b\u0002\u0010\u0005\u001a\u00020\u0003\u0012\b\b\u0002\u0010\u0006\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0007J\t\u0010\u0012\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0013\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0014\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0015\u001a\u00020\u0003H\u00c6\u0003J1\u0010\u0016\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00032\b\b\u0002\u0010\u0006\u001a\u00020\u0003H\u00c6\u0001J\u0013\u0010\u0017\u001a\u00020\u00182\b\u0010\u0019\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010\u001a\u001a\u00020\u001bH\u00d6\u0001J\t\u0010\u001c\u001a\u00020\u001dH\u00d6\u0001R\u001a\u0010\u0002\u001a\u00020\u0003X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\b\b\u0010\t\"\u0004\b\n\u0010\u000bR\u001a\u0010\u0004\u001a\u00020\u0003X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\b\f\u0010\t\"\u0004\b\r\u0010\u000bR\u001a\u0010\u0005\u001a\u00020\u0003X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\b\u000e\u0010\t\"\u0004\b\u000f\u0010\u000bR\u001a\u0010\u0006\u001a\u00020\u0003X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\b\u0010\u0010\t\"\u0004\b\u0011\u0010\u000b\u00a8\u0006\u001e"}, d2 = {"Lcom/example/mobiledatamonitor/data/DataUsageRepository$AppUsageData;", "", "mobileRx", "", "mobileTx", "wifiRx", "wifiTx", "(JJJJ)V", "getMobileRx", "()J", "setMobileRx", "(J)V", "getMobileTx", "setMobileTx", "getWifiRx", "setWifiRx", "getWifiTx", "setWifiTx", "component1", "component2", "component3", "component4", "copy", "equals", "", "other", "hashCode", "", "toString", "", "app_debug"})
    static final class AppUsageData {
        private long mobileRx;
        private long mobileTx;
        private long wifiRx;
        private long wifiTx;
        
        public AppUsageData(long mobileRx, long mobileTx, long wifiRx, long wifiTx) {
            super();
        }
        
        public final long getMobileRx() {
            return 0L;
        }
        
        public final void setMobileRx(long p0) {
        }
        
        public final long getMobileTx() {
            return 0L;
        }
        
        public final void setMobileTx(long p0) {
        }
        
        public final long getWifiRx() {
            return 0L;
        }
        
        public final void setWifiRx(long p0) {
        }
        
        public final long getWifiTx() {
            return 0L;
        }
        
        public final void setWifiTx(long p0) {
        }
        
        public AppUsageData() {
            super();
        }
        
        public final long component1() {
            return 0L;
        }
        
        public final long component2() {
            return 0L;
        }
        
        public final long component3() {
            return 0L;
        }
        
        public final long component4() {
            return 0L;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final com.example.mobiledatamonitor.data.DataUsageRepository.AppUsageData copy(long mobileRx, long mobileTx, long wifiRx, long wifiTx) {
            return null;
        }
        
        @java.lang.Override()
        public boolean equals(@org.jetbrains.annotations.Nullable()
        java.lang.Object other) {
            return false;
        }
        
        @java.lang.Override()
        public int hashCode() {
            return 0;
        }
        
        @java.lang.Override()
        @org.jetbrains.annotations.NotNull()
        public java.lang.String toString() {
            return null;
        }
    }
}