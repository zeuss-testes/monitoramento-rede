package com.example.mobiledatamonitor.data;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0003\u0018\u0000 \n2\u00020\u0001:\u0001\nB\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\b\u0010\u0005\u001a\u0004\u0018\u00010\u0006J\u000e\u0010\u0007\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\u0006R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u000b"}, d2 = {"Lcom/example/mobiledatamonitor/data/UserManager;", "", "prefs", "Landroid/content/SharedPreferences;", "(Landroid/content/SharedPreferences;)V", "getCurrentEmployee", "Lcom/example/mobiledatamonitor/data/EmployeeProfile;", "saveEmployee", "", "profile", "Companion", "app_debug"})
public final class UserManager {
    @org.jetbrains.annotations.NotNull()
    private final android.content.SharedPreferences prefs = null;
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_NAME = "employee_name";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_EMAIL = "employee_email";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_PHONE = "employee_phone";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_CUSTOM_IMEI = "employee_custom_imei";
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String KEY_ROLE = "employee_role";
    @org.jetbrains.annotations.NotNull()
    public static final com.example.mobiledatamonitor.data.UserManager.Companion Companion = null;
    
    public UserManager(@org.jetbrains.annotations.NotNull()
    android.content.SharedPreferences prefs) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.example.mobiledatamonitor.data.EmployeeProfile getCurrentEmployee() {
        return null;
    }
    
    public final void saveEmployee(@org.jetbrains.annotations.NotNull()
    com.example.mobiledatamonitor.data.EmployeeProfile profile) {
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0014\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0005\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\t"}, d2 = {"Lcom/example/mobiledatamonitor/data/UserManager$Companion;", "", "()V", "KEY_CUSTOM_IMEI", "", "KEY_EMAIL", "KEY_NAME", "KEY_PHONE", "KEY_ROLE", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}