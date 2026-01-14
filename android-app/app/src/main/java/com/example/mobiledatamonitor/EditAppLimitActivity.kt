package com.example.mobiledatamonitor

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mobiledatamonitor.databinding.ActivityEditAppLimitBinding
import kotlinx.coroutines.launch

class EditAppLimitActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditAppLimitBinding
    private lateinit var database: AppDatabase
    private var currentAppLimit: AppLimit? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditAppLimitBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        database = AppDatabase.getInstance(this)
        val packageName = intent.getStringExtra("packageName") ?: return
        
        lifecycleScope.launch {
            currentAppLimit = database.appLimitDao().getByPackage(packageName)
            currentAppLimit?.let {
                binding.timeLimitInput.setText((it.timeLimit / (60 * 1000)).toString())
                binding.whitelistCheckbox.isChecked = it.isWhitelisted
            }
        }
        
        binding.saveButton.setOnClickListener {
            val timeLimitMinutes = binding.timeLimitInput.text.toString().toLongOrNull() ?: 10L
            val timeLimitMs = timeLimitMinutes * 60 * 1000L  // Add 'L' suffix to make it Long
            val isWhitelisted = binding.whitelistCheckbox.isChecked
            
            lifecycleScope.launch {
                val newAppLimit = currentAppLimit?.copy(
                    timeLimit = timeLimitMs,
                    isWhitelisted = isWhitelisted
                ) ?: AppLimit(packageName, timeLimitMs, isWhitelisted)
                
                if (currentAppLimit == null) {
                    database.appLimitDao().insert(newAppLimit)
                } else {
                    database.appLimitDao().update(newAppLimit)
                }
                finish()
            }
        }
    }
}
