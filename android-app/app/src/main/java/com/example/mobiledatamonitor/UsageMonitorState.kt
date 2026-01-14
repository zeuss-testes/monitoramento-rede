package com.example.mobiledatamonitor

import com.example.mobiledatamonitor.data.AppUsageInfo
import com.example.mobiledatamonitor.data.DataPlanSettings
import com.example.mobiledatamonitor.data.DataPlanStatus
import com.example.mobiledatamonitor.data.UsageRange
import com.example.mobiledatamonitor.data.UsageTotals

data class UsageMonitorState(
    val range: UsageRange = UsageRange.TODAY,
    val totals: UsageTotals? = null,
    val appsUsage: List<AppUsageInfo> = emptyList(),
    val dataPlanStatus: DataPlanStatus? = null,
    val dataPlanSettings: DataPlanSettings = DataPlanSettings(),
    val isLoading: Boolean = false,
    val hasUsagePermission: Boolean = false,
    val hasPhonePermission: Boolean = false,
    val lastUpdatedMillis: Long? = null,
    val errorMessage: String? = null,
    val selectedTab: Int = 0, // 0 = Resumo, 1 = Apps, 2 = Plano
    val employeeName: String? = null,
    val isAdmin: Boolean = false
)
