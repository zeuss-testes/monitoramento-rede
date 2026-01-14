package com.example.mobiledatamonitor.data

import android.content.SharedPreferences

class UserManager(private val prefs: SharedPreferences) {

    fun getCurrentEmployee(): EmployeeProfile? {
        val name = prefs.getString(KEY_NAME, null) ?: return null
        val email = prefs.getString(KEY_EMAIL, null)
        val phone = prefs.getString(KEY_PHONE, null)
        val customImei = prefs.getString(KEY_CUSTOM_IMEI, null)
        val roleString = prefs.getString(KEY_ROLE, UserRole.COMMON.name) ?: UserRole.COMMON.name
        val role = runCatching { UserRole.valueOf(roleString) }.getOrDefault(UserRole.COMMON)
        
        android.util.Log.d("UserManager", "Recuperando employee: name=$name, email=$email, phone=$phone, customImei=$customImei, role=$role")
        
        return EmployeeProfile(name = name, email = email, phone = phone, role = role, customImei = customImei)
    }

    fun saveEmployee(profile: EmployeeProfile) {
        android.util.Log.d("UserManager", "Salvando employee: $profile")
        
        prefs.edit()
            .putString(KEY_NAME, profile.name)
            .putString(KEY_EMAIL, profile.email)
            .putString(KEY_PHONE, profile.phone)
            .putString(KEY_CUSTOM_IMEI, profile.customImei)
            .putString(KEY_ROLE, profile.role.name)
            .apply()
            
        android.util.Log.d("UserManager", "Employee salvo com sucesso")
    }

    companion object {
        private const val KEY_NAME = "employee_name"
        private const val KEY_EMAIL = "employee_email"
        private const val KEY_PHONE = "employee_phone"
        private const val KEY_CUSTOM_IMEI = "employee_custom_imei"
        private const val KEY_ROLE = "employee_role"
    }
}
