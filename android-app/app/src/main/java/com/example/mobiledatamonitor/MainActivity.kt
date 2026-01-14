package com.example.mobiledatamonitor

import android.Manifest
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.activity.compose.rememberLauncherForActivityResult
import com.example.mobiledatamonitor.notifications.NotificationHelper
import com.example.mobiledatamonitor.permissions.openUsageAccessSettings
import com.example.mobiledatamonitor.ui.MonitorScreen
import com.example.mobiledatamonitor.ui.theme.MobileDataMonitorTheme
import com.example.mobiledatamonitor.worker.WorkManagerHelper

class MainActivity : ComponentActivity() {

    private val viewModel: UsageMonitorViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Criar canais de notificação
        NotificationHelper.createNotificationChannels(this)
        
        // Agendar monitoramento em background
        android.util.Log.d("MainActivity", "Agendando WorkManager...")
        WorkManagerHelper.scheduleDataUsageMonitoring(this)
        android.util.Log.d("MainActivity", "WorkManager agendado")

        // Solicitar permissão de notificação no Android 13+
        requestNotificationPermission()
        
        // Solicitar permissão READ_PHONE_STATE para obter IMEI real
        requestReadPhoneStatePermission()

        setContent {
            MobileDataMonitorTheme {
                val state by viewModel.state.collectAsStateWithLifecycle()

                val phonePermissionLauncher = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.RequestPermission()
                ) { granted ->
                    viewModel.refreshPermissions()
                    if (granted) {
                        viewModel.refreshUsage(force = true)
                    }
                }

                MonitorScreen(
                    modifier = Modifier.fillMaxSize(),
                    state = state,
                    onRangeSelected = { range -> viewModel.onRangeSelected(range) },
                    onRefresh = { viewModel.refreshUsage(force = true) },
                    onRequestUsagePermission = {
                        openUsageAccessSettings()
                    },
                    onRequestPhonePermission = {
                        phonePermissionLauncher.launch(Manifest.permission.READ_PHONE_STATE)
                    },
                    onTabSelected = { tabIndex -> viewModel.onTabSelected(tabIndex) }
                )
            }
        }
    }

    override fun onResume() {
        super.onResume()
        viewModel.refreshPermissions()
        viewModel.refreshUsage()
    }

    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { _ -> }

    private val readPhoneStatePermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            // Permissão concedida, pode tentar obter IMEI real
            viewModel.refreshUsage(force = true)
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }
    
    private fun requestReadPhoneStatePermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            // Só solicita em versões anteriores ao Android 10
            readPhoneStatePermissionLauncher.launch(Manifest.permission.READ_PHONE_STATE)
        }
    }
}
