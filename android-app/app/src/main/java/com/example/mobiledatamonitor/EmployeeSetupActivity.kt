package com.example.mobiledatamonitor

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.mobiledatamonitor.data.EmployeeProfile
import com.example.mobiledatamonitor.data.UserManager
import com.example.mobiledatamonitor.data.UserRole

class EmployeeSetupActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_employee_setup)

        val nameInput = findViewById<EditText>(R.id.employee_name_input)
        val emailInput = findViewById<EditText>(R.id.employee_email_input)
        val phoneInput = findViewById<EditText>(R.id.employee_phone_input)
        val imeiInput = findViewById<EditText>(R.id.employee_imei_input)
        val imeiLabel = findViewById<TextView>(R.id.employee_imei_label)
        val roleGroup = findViewById<RadioGroup>(R.id.employee_role_group)
        val saveButton = findViewById<Button>(R.id.save_employee_button)

        // Verifica versão Android e ajusta obrigatoriedade do IMEI
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            imeiLabel.text = "IMEI (obrigatório em Android 10+)"
            imeiInput.hint = "Digite o IMEI do dispositivo"
        } else {
            imeiLabel.text = "IMEI (opcional)"
            imeiInput.hint = "Deixe em branco para usar automático"
        }

        saveButton.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val email = emailInput.text.toString().trim().ifBlank { null }
            val phone = phoneInput.text.toString().trim().ifBlank { null }
            val imei = imeiInput.text.toString().trim().ifBlank { null }

            Log.d("EmployeeSetupActivity", "Dados preenchidos: name=$name, email=$email, phone=$phone, imei=$imei")

            if (name.isEmpty()) {
                Toast.makeText(this, "Informe o nome do funcionário", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Validação do IMEI obrigatório em Android 10+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && imei.isNullOrEmpty()) {
                Toast.makeText(this, "IMEI é obrigatório em Android 10+", Toast.LENGTH_LONG).show()
                imeiInput.requestFocus()
                return@setOnClickListener
            }

            val selectedRoleId = roleGroup.checkedRadioButtonId
            val role = if (selectedRoleId == R.id.role_admin) UserRole.ADMIN else UserRole.COMMON

            val prefs = getSharedPreferences("data_monitor_prefs", MODE_PRIVATE)
            val userManager = UserManager(prefs)
            val profile = EmployeeProfile(name = name, email = email, phone = phone, role = role, customImei = imei)
            
            Log.d("EmployeeSetupActivity", "Salvando profile: $profile")
            
            userManager.saveEmployee(profile)
            Log.d("EmployeeSetupActivity", "Profile salvo com sucesso")

            Toast.makeText(this, "Funcionário cadastrado com sucesso!", Toast.LENGTH_SHORT).show()
            
            // Ir para a tela principal
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
    }
}
