package com.example.mobiledatamonitor.debug

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mobiledatamonitor.R
import com.example.mobiledatamonitor.data.BackendClient
import kotlinx.coroutines.launch

class BackendTestActivity : AppCompatActivity() {
    
    private lateinit var backendClient: BackendClient
    private lateinit var logText: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_backend_test)
        
        backendClient = BackendClient(this, getSharedPreferences("data_monitor_prefs", MODE_PRIVATE))
        logText = findViewById(R.id.log_text)
        
        findViewById<Button>(R.id.test_connection_btn).setOnClickListener {
            testConnection()
        }
        
        findViewById<Button>(R.id.test_limits_btn).setOnClickListener {
            testDataLimits()
        }
        
        findViewById<Button>(R.id.clear_log_btn).setOnClickListener {
            logText.text = ""
        }
    }
    
    private fun testConnection() {
        lifecycleScope.launch {
            appendLog("Testando conexão com backend...")
            
            val isConnected = backendClient.testConnection()
            if (isConnected) {
                appendLog("✅ Conexão bem-sucedida com backend!")
            } else {
                appendLog("❌ Falha na conexão com backend")
                appendLog("Verifique se:")
                appendLog("1. O backend está rodando na porta 4000")
                appendLog("2. O dispositivo está na mesma rede")
                appendLog("3. O IP está correto")
            }
        }
    }
    
    private fun testDataLimits() {
        lifecycleScope.launch {
            appendLog("Testando busca de limites de dados...")
            
            // Testar com IMEI de exemplo
            val testImeis = listOf("351892176157472", "351892176344872")
            
            for (imei in testImeis) {
                appendLog("Buscando limite para IMEI: $imei")
                val limit = backendClient.getDeviceDataLimit(imei)
                if (limit != null) {
                    appendLog("✅ Limite encontrado: ${limit}MB")
                } else {
                    appendLog("❌ Limite não encontrado para IMEI: $imei")
                }
            }
        }
    }
    
    private fun appendLog(message: String) {
        runOnUiThread {
            val timestamp = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault())
                .format(java.util.Date())
            logText.append("[$timestamp] $message\n")
        }
    }
}
