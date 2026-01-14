package com.example.mobiledatamonitor

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.mobiledatamonitor.data.TursoClient
import com.example.mobiledatamonitor.data.BackendSyncHelper
import com.example.mobiledatamonitor.data.DataPlanSettings
import com.example.mobiledatamonitor.data.DataUsageRepository
import com.example.mobiledatamonitor.data.UsageRange
import com.example.mobiledatamonitor.data.UserManager
import com.example.mobiledatamonitor.data.UserRole
import com.example.mobiledatamonitor.permissions.hasPhoneStatePermission
import com.example.mobiledatamonitor.permissions.hasUsageStatsPermission
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class UsageMonitorViewModel(application: Application) : AndroidViewModel(application) {

    private val appContext = application.applicationContext
    private val repository = DataUsageRepository(application)
    private val prefs = application.getSharedPreferences("data_monitor_prefs", Context.MODE_PRIVATE)
    private val tursoClient = TursoClient(appContext, prefs)
    private val userManager = UserManager(prefs)

    private val _state = MutableStateFlow(UsageMonitorState())
    val state: StateFlow<UsageMonitorState> = _state

    private var autoRefreshJob: Job? = null

    init {
        refreshPermissions()
        refreshUsage(force = true)
        scheduleAutoRefresh()
        registerDeviceWithBackend()
        loadEmployeeProfile()
    }

    fun onRangeSelected(range: UsageRange) {
        _state.update { it.copy(range = range) }
        refreshUsage(force = true)
    }

    fun onTabSelected(tabIndex: Int) {
        _state.update { it.copy(selectedTab = tabIndex) }
    }

    fun updateDataPlanLimit(limitGB: Float) {
        val limitBytes = (limitGB * 1024 * 1024 * 1024).toLong()
        _state.update { 
            it.copy(dataPlanSettings = it.dataPlanSettings.copy(monthlyLimitBytes = limitBytes))
        }
        refreshDataPlanStatus()
    }

    fun refreshUsage(force: Boolean = false) {
        val currentState = _state.value
        if (!currentState.hasUsagePermission) {
            _state.update { it.copy(errorMessage = null, totals = null, isLoading = false) }
            return
        }

        if (currentState.isLoading && !force) return

        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val totals = withContext(Dispatchers.IO) {
                    repository.readUsage(_state.value.range)
                }
                val appsUsage = withContext(Dispatchers.IO) {
                    repository.getAppsUsage(_state.value.range)
                }
                val dataPlanStatus = withContext(Dispatchers.IO) {
                    repository.getDataPlanStatus(_state.value.dataPlanSettings)
                }

                if (totals != null) {
                    withContext(Dispatchers.IO) {
                        BackendSyncHelper.syncDeltaIfNeeded(appContext, prefs, totals)
                    }
                }
                
                _state.update {
                    it.copy(
                        isLoading = false,
                        totals = totals,
                        appsUsage = appsUsage,
                        dataPlanStatus = dataPlanStatus,
                        lastUpdatedMillis = System.currentTimeMillis(),
                        errorMessage = null
                    )
                }
            } catch (security: SecurityException) {
                _state.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = security.localizedMessage ?: "Falha ao ler os dados"
                    )
                }
            }
        }
    }

    private fun registerDeviceWithBackend() {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                tursoClient.ensureDeviceId(DataPlanSettings())
            } catch (_: Exception) {
                // erro silencioso, não deve quebrar a UI
            }
        }
    }

    private fun loadEmployeeProfile() {
        val employee = userManager.getCurrentEmployee()
        _state.update {
            it.copy(
                employeeName = employee?.name,
                isAdmin = employee?.role == UserRole.ADMIN
            )
        }
    }

    private fun refreshDataPlanStatus() {
        viewModelScope.launch {
            try {
                val dataPlanStatus = withContext(Dispatchers.IO) {
                    repository.getDataPlanStatus(_state.value.dataPlanSettings)
                }
                _state.update { it.copy(dataPlanStatus = dataPlanStatus) }
            } catch (e: Exception) {
                // Ignorar erros
            }
        }
    }

    fun refreshPermissions() {
        val context = getApplication<Application>()
        val hasUsagePermission = context.hasUsageStatsPermission()
        val hasPhonePermission = context.hasPhoneStatePermission()
        _state.update {
            it.copy(
                hasUsagePermission = hasUsagePermission,
                hasPhonePermission = hasPhonePermission
            )
        }
    }

    private fun scheduleAutoRefresh() {
        autoRefreshJob?.cancel()
        autoRefreshJob = viewModelScope.launch {
            while (true) {
                delay(10_000)
                refreshUsage(force = true)
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        autoRefreshJob?.cancel()
    }
}
