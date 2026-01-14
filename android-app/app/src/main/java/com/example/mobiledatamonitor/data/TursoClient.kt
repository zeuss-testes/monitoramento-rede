package com.example.mobiledatamonitor.data

import android.content.Context
import android.content.SharedPreferences
import android.Manifest
import android.os.Build
import android.provider.Settings
import android.telephony.TelephonyManager
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.time.Instant

class TursoClient(
    private val context: Context,
    private val prefs: SharedPreferences
) {

    companion object {
        private const val PREF_DEVICE_ID = "turso_device_id"
        private const val TAG = "TursoClient"
        
        // Configurações do Turso
        private const val TURSO_URL = "https://rede-scan-zeuss.aws-us-east-1.turso.io/v2/pipeline"
        private const val TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjgyMjU3NjUsImlkIjoiNTc0N2ZmMjctNmMwNS00MmQzLWE4NjMtMDUzYTg3MzljMjk5IiwicmlkIjoiYWU3NWJlYzYtMGUxYy00OGY1LWI5ZjAtM2M4MjljODBhNzY1In0.PJPf3Ed339gD1EeqWm3C0_c0qwnKHv5elOcAjBNAC-Lkt1_I-nRTRzytlI9Rc0Yws6GZG1xwKKJFJ1J91NmFCg"
    }

    private val userManager = UserManager(prefs)

    private fun getRealImei(customImei: String?): String {
        // Se foi informado IMEI manualmente, usa ele
        if (!customImei.isNullOrBlank()) {
            Log.d(TAG, "Usando IMEI manual: $customImei")
            return customImei
        }
        
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+ - IMEI manual obrigatório
                Log.e(TAG, "Android 10+ requer IMEI manual, mas não foi informado")
                throw SecurityException("IMEI manual obrigatório em Android 10+")
            } else {
                val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
                
                // Verificar permissão READ_PHONE_STATE
                if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    val imei = telephonyManager.deviceId
                    if (!imei.isNullOrBlank()) {
                        Log.d(TAG, "IMEI real obtido: $imei")
                        imei
                    } else {
                        Log.e(TAG, "IMEI nulo, falha ao obter IMEI real")
                        throw SecurityException("Não foi possível obter IMEI real")
                    }
                } else {
                    Log.e(TAG, "Permissão READ_PHONE_STATE não concedida")
                    throw SecurityException("Permissão READ_PHONE_STATE necessária")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao obter IMEI: ${e.message}", e)
            throw e
        }
    }

    suspend fun ensureDeviceId(settings: DataPlanSettings): String? = withContext(Dispatchers.IO) {
        var retryCount = 0
        val maxRetries = 3
        
        while (retryCount < maxRetries) {
            try {
                val employee = userManager.getCurrentEmployee()
                Log.d(TAG, "Employee: ${employee?.name}, customImei: ${employee?.customImei}")
                
                val deviceId = getRealImei(employee?.customImei)
                Log.d(TAG, "DeviceId obtido: $deviceId")
                
                val existing = prefs.getString(PREF_DEVICE_ID, null)
                Log.d(TAG, "DeviceId existente no prefs: $existing")
                
                // Se o IMEI mudou (manualmente), limpa o cache e usa o novo
                if (!existing.isNullOrBlank() && existing != deviceId) {
                    Log.d(TAG, "IMEI mudou de $existing para $deviceId, limpando cache")
                    prefs.edit().remove(PREF_DEVICE_ID).apply()
                }
                
                if (!existing.isNullOrBlank() && existing == deviceId) {
                    Log.d(TAG, "IMEI já existe (prefs): $existing")
                    return@withContext existing
                }

                val baseName = "${Build.MANUFACTURER} ${Build.MODEL}".trim().ifBlank { "Android Device" }
                val deviceName = if (employee != null) {
                    employee.name
                } else {
                    baseName
                }
                val phoneNumber = if (employee != null) {
                    employee.phone
                } else {
                    "0000000000"
                }

                // Verifica se já existe no banco antes de inserir (evita duplicar linhas)
                val existsSql = "SELECT imei FROM registros_usuarios WHERE imei = ? LIMIT 1"
                val existsResult = executeSQL(existsSql, listOf(deviceId))
                val alreadyThere = try {
                    if (existsResult != null) {
                        val resultsArr = existsResult.optJSONArray("results")
                        val first = resultsArr?.optJSONObject(0)
                        val response = first?.optJSONObject("response")
                        val resultObj = response?.optJSONObject("result")
                        val rows = resultObj?.optJSONArray("rows")
                        rows != null && rows.length() > 0
                    } else {
                        false
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Erro ao verificar existência: ${e.message}", e)
                    false
                }
                
                Log.d(TAG, "IMEI $deviceId já existe no banco? $alreadyThere")
                
                if (alreadyThere) {
                    prefs.edit().putString(PREF_DEVICE_ID, deviceId).apply()
                    Log.d(TAG, "IMEI já existe no banco: $deviceId")
                    return@withContext deviceId
                }

                // Se chegou aqui, não existe no banco e nem no prefs → insere
                Log.d(TAG, "IMEI não encontrado em prefs nem banco → criando novo usuário: $deviceName")

                val sql = "INSERT INTO registros_usuarios (imei, nome, numero, consumo_total) VALUES (?, ?, ?, ?)"
                val params = listOf(deviceId, deviceName, phoneNumber, "0.0")

                val result = executeSQL(sql, params)
                
                result?.let {
                    try {
                        val rows = it.getJSONArray("results")
                        if (rows.length() > 0) {
                            val firstResult = rows.getJSONObject(0)
                            val response = firstResult.getJSONObject("response")
                            val resultObj = response.getJSONObject("result")
                            val lastInsertRowid = resultObj.getString("last_insert_rowid")
                            
                            if (lastInsertRowid.isNotEmpty()) {
                                prefs.edit().putString(PREF_DEVICE_ID, deviceId).apply()
                                Log.d(TAG, "Usuário criado com sucesso: $deviceId")
                                return@withContext deviceId
                            } else {
                                Log.e(TAG, "Falha ao criar usuário")
                                null
                            }
                        } else {
                            Log.e(TAG, "Resposta vazia do servidor")
                            null
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "Erro ao processar resposta: ${e.message}", e)
                        null
                    }
                } ?: run {
                    Log.e(TAG, "Falha ao executar SQL")
                    null
                }
                
            } catch (e: Exception) {
                retryCount++
                Log.e(TAG, "Erro ao obter/configurar IMEI (tentativa $retryCount/$maxRetries): ${e.message}", e)
                
                if (retryCount < maxRetries) {
                    Log.d(TAG, "Aguardando 2 segundos antes de retry...")
                    kotlinx.coroutines.delay(2000)
                } else {
                    Log.e(TAG, "Número máximo de tentativas alcançado")
                    return@withContext null
                }
            }
        }
        
        null
    }

    suspend fun sendUsage(imei: String, megabytes: Double, recordedAt: Instant) = withContext(Dispatchers.IO) {
        Log.d(TAG, "sendUsage iniciado: imei=$imei, megabytes=$megabytes")
        
        val formattedMegabytes = String.format("%.2f", megabytes)

        // Apenas atualiza consumo_total; evita falhas por FK em usage_logs
        val updateSql = "UPDATE registros_usuarios SET consumo_total = ? WHERE imei = ?"
        val updateParams = listOf(formattedMegabytes, imei)
        val updateResult = executeSQL(updateSql, updateParams)
        Log.d(TAG, "Resultado UPDATE registros_usuarios: ${updateResult != null}")
    }

    /**
     * Atualiza a coluna dados_apps_json com JSON de uso por app (mês atual).
     */
    suspend fun updateAppsJson(imei: String, appsJson: String) = withContext(Dispatchers.IO) {
        Log.d(TAG, "updateAppsJson: imei=$imei, jsonLength=${appsJson.length}")
        val sql = "UPDATE registros_usuarios SET dados_apps_json = ? WHERE imei = ?"
        val params = listOf(appsJson, imei)
        val result = executeSQL(sql, params)
        if (result == null) {
            throw Exception("Erro ao atualizar dados_apps_json para IMEI $imei")
        }
    }

    private suspend fun executeSQL(sql: String, params: List<String?>): JSONObject? = withContext(Dispatchers.IO) {
        try {
            val url = URL(TURSO_URL)
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 15000
                readTimeout = 15000
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Authorization", "Bearer $TURSO_AUTH_TOKEN")
            }

            val requestBody = JSONObject().apply {
                put("requests", JSONArray().put(
                    JSONObject().apply {
                        put("type", "execute")
                        put("stmt", JSONObject().apply {
                            put("sql", sql)
                            // Turso pipeline espera args tipados; enviamos sempre texto (ou null)
                            put("args", JSONArray().apply {
                                params.forEach { param ->
                                    if (param == null) {
                                        put(JSONObject().apply {
                                            put("type", "null")
                                        })
                                    } else {
                                        put(JSONObject().apply {
                                            put("type", "text")
                                            put("value", param)
                                        })
                                    }
                                }
                            })
                        })
                    }
                ))
            }

            // Envia o corpo
            connection.outputStream.use { os ->
                OutputStreamWriter(os, Charsets.UTF_8).use { writer ->
                    writer.write(requestBody.toString())
                }
            }

            // Lê resposta
            val responseCode = connection.responseCode
            val responseBody = if (responseCode in 200..299) {
                connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            } else {
                connection.errorStream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() }
            }

            val bodyLog = responseBody ?: "null"
            Log.d(TAG, "executeSQL status=$responseCode body=$bodyLog")

            if (responseCode !in 200..299) {
                throw Exception("Erro HTTP $responseCode: ${responseBody ?: "sem corpo"}")
            }

            if (!responseBody.isNullOrBlank()) {
                JSONObject(responseBody)
            } else {
                Log.e(TAG, "Response vazio")
                null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Erro na requisição SQL: ${e.message}", e)
            null
        } finally {
            // Connection is automatically closed by try-with-resources
        }
    }

    suspend fun testConnection(): Boolean = withContext(Dispatchers.IO) {
        try {
            val sql = "SELECT COUNT(*) as count FROM registros_usuarios"
            val result = executeSQL(sql, emptyList<String?>())
            result != null
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao testar conexão: ${e.message}", e)
            false
        }
    }
}
