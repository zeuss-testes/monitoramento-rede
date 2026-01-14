package com.example.mobiledatamonitor

import android.content.Intent
import android.os.Bundle
import android.view.inputmethod.EditorInfo
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.doAfterTextChanged
import com.example.mobiledatamonitor.data.UserManager

class PasswordActivity : AppCompatActivity() {

    private val defaultPassword = "123456"
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_password)
        
        val passwordInput = findViewById<EditText>(R.id.password_input)
        val submitButton = findViewById<Button>(R.id.submit_button)
        
        // Permitir enviar pelo botão "Done" do teclado
        passwordInput.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                submitButton.performClick()
                true
            } else {
                false
            }
        }
        
        submitButton.setOnClickListener {
            val enteredPassword = passwordInput.text.toString()
            if (enteredPassword == defaultPassword) {
                val prefs = getSharedPreferences("data_monitor_prefs", MODE_PRIVATE)
                val userManager = UserManager(prefs)
                val existingEmployee = userManager.getCurrentEmployee()

                val nextActivity = if (existingEmployee != null) {
                    MainActivity::class.java
                } else {
                    EmployeeSetupActivity::class.java
                }

                startActivity(Intent(this, nextActivity))
                finish()
            } else {
                Toast.makeText(this, "Senha incorreta", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
