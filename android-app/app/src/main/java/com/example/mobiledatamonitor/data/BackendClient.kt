package com.example.mobiledatamonitor.data

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class BackendClient(
    private val context: Context,
    private val prefs: SharedPreferences
) {
    companion object {
        private const val TAG = "BackendClient"
        private const val DEFAULT_PORT = 4000
        // IPs comuns para testes - ajustar conforme necessário
        private val POSSIBLE_IPS = listOf(
            "10.0.2.2", // Emulador Android padrão
            "192.168.1.10", // Exemplo de IP local
            "192.168.0.1", // Outro exemplo comum
            "localhost"  // Para testes locais
        )
    }

    private val userManager = UserManager(prefs)

    private suspend fun getWorkingBaseUrl(): String? = withContext(Dispatchers.IO) {
        // Verificar se há um IP salvo nos preferences
        val savedIp = prefs.getString("backend_ip", null)
        if (savedIp != null) {
            val testUrl = "http://$savedIp:$DEFAULT_PORT/health"
            if (testConnection(testUrl)) {
                Log.d(TAG, "Usando IP salvo: $savedIp")
                return@withContext "http://$savedIp:$DEFAULT_PORT"
            }
        }

        // Tentar cada IP possível
        for (ip in POSSIBLE_IPS) {
            val testUrl = "http://$ip:$DEFAULT_PORT/health"
            Log.d(TAG, "Testando conexão com: $testUrl")
            
            if (testConnection(testUrl)) {
                // Salvar IP funcionando para próximas vezes
                prefs.edit().putString("backend_ip", ip).apply()
                Log.d(TAG, "IP funcionando encontrado: $ip")
                return@withContext "http://$ip:$DEFAULT_PORT"
            }
        }
        
        Log.e(TAG, "Nenhum IP do backend está respondendo")
        return@withContext null
    }

    private suspend fun testConnection(url: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 3000
            connection.readTimeout = 3000
            
            val responseCode = connection.responseCode
            connection.disconnect()
            
            responseCode in 200..299
        } catch (e: Exception) {
            Log.d(TAG, "Falha na conexão com $url: ${e.message}")
            false
        }
    }

    suspend fun getDeviceDataLimit(imei: String): Double? = withContext(Dispatchers.IO) {
        try {
            Log.d(TAG, "Buscando limite de dados para IMEI: $imei")
            
            val baseUrl = getWorkingBaseUrl()
            if (baseUrl == null) {
                Log.e(TAG, "Não foi possível conectar ao backend")
                return@withContext null
            }
            
            val url = URL("$baseUrl/devices")
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 10000
                readTimeout = 10000
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Accept", "application/json")
            }

            val responseCode = connection.responseCode
            val responseBody = if (responseCode in 200..299) {
                connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            } else {
                connection.errorStream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() }
            }

            Log.d(TAG, "Response code: $responseCode")
            Log.d(TAG, "Response body: $responseBody")

            if (responseCode in 200..299 && !responseBody.isNullOrBlank()) {
                val devicesArray = org.json.JSONArray(responseBody)
                
                for (i in 0 until devicesArray.length()) {
                    val device = devicesArray.getJSONObject(i)
                    val deviceImei = device.getString("imei")
                    
                    if (deviceImei == imei) {
                        val limit = device.getDouble("dataLimitMb")
                        Log.d(TAG, "Limite encontrado para IMEI $imei: $limit MB")
                        return@withContext limit
                    }
                }
                
                Log.d(TAG, "IMEI $imei não encontrado na lista de dispositivos")
                return@withContext null
            } else {
                Log.e(TAG, "Erro na requisição: $responseCode - $responseBody")
                return@withContext null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao buscar limite do backend: ${e.message}", e)
            return@withContext null
        }
    }

    suspend fun updateDeviceLimit(imei: String, limitMb: Double): Boolean = withContext(Dispatchers.IO) {
        try {
            Log.d(TAG, "Atualizando limite para IMEI: $imei, novo limite: $limitMb MB")
            
            val baseUrl = getWorkingBaseUrl()
            if (baseUrl == null) {
                Log.e(TAG, "Não foi possível conectar ao backend")
                return@withContext false
            }
            
            // Primeiro, buscar o ID do dispositivo pelo IMEI
            val devices = getAllDevices()
            val device = devices.find { it.imei == imei }
            
            if (device == null) {
                Log.e(TAG, "Dispositivo com IMEI $imei não encontrado")
                return@withContext false
            }

            val url = URL("$baseUrl/devices/${device.id}")
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "PUT"
                connectTimeout = 10000
                readTimeout = 10000
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Accept", "application/json")
            }

            val requestBody = JSONObject().apply {
                put("dataLimitMb", limitMb)
            }

            connection.outputStream.use { os ->
                OutputStreamWriter(os, Charsets.UTF_8).use { writer ->
                    writer.write(requestBody.toString())
                }
            }

            val responseCode = connection.responseCode
            val responseBody = if (responseCode in 200..299) {
                connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            } else {
                connection.errorStream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() }
            }

            Log.d(TAG, "Update response code: $responseCode")
            Log.d(TAG, "Update response body: $responseBody")

            if (responseCode in 200..299) {
                Log.d(TAG, "Limite atualizado com sucesso para IMEI $imei")
                return@withContext true
            } else {
                Log.e(TAG, "Erro ao atualizar limite: $responseCode - $responseBody")
                return@withContext false
            }
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao atualizar limite: ${e.message}", e)
            return@withContext false
        }
    }

    private suspend fun getAllDevices(): List<Device> = withContext(Dispatchers.IO) {
        try {
            val baseUrl = getWorkingBaseUrl()
            if (baseUrl == null) {
                Log.e(TAG, "Não foi possível conectar ao backend")
                return@withContext emptyList()
            }
            
            val url = URL("$baseUrl/devices")
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 10000
                readTimeout = 10000
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Accept", "application/json")
            }

            val responseCode = connection.responseCode
            val responseBody = if (responseCode in 200..299) {
                connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            } else {
                connection.errorStream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() }
            }

            if (responseCode in 200..299 && !responseBody.isNullOrBlank()) {
                val devicesArray = org.json.JSONArray(responseBody)
                val devices = mutableListOf<Device>()
                
                for (i in 0 until devicesArray.length()) {
                    val deviceJson = devicesArray.getJSONObject(i)
                    devices.add(
                        Device(
                            id = deviceJson.getInt("id"),
                            imei = deviceJson.getString("imei"),
                            name = deviceJson.getString("name"),
                            dataLimitMb = deviceJson.getDouble("dataLimitMb")
                        )
                    )
                }
                
                return@withContext devices
            } else {
                Log.e(TAG, "Erro ao buscar dispositivos: $responseCode")
                return@withContext emptyList()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao buscar dispositivos: ${e.message}", e)
            return@withContext emptyList()
        }
    }

    data class Device(
        val id: Int,
        val imei: String,
        val name: String,
        val dataLimitMb: Double
    )

    // Método público para testar conexão (útil para diagnóstico)
    suspend fun testConnection(): Boolean = withContext(Dispatchers.IO) {
        val baseUrl = getWorkingBaseUrl()
        baseUrl != null
    }
}
