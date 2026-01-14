package com.example.mobiledatamonitor.data

enum class UserRole {
    ADMIN,
    COMMON
}

data class EmployeeProfile(
    val name: String,
    val email: String?,
    val phone: String?,
    val role: UserRole,
    val customImei: String? = null
)
