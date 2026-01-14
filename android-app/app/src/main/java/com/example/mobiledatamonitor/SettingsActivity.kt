package com.example.mobiledatamonitor

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import androidx.lifecycle.lifecycleScope

class SettingsActivity : AppCompatActivity() {

    private lateinit var appListRecyclerView: RecyclerView
    private lateinit var adapter: AppListAdapter
    private lateinit var database: AppDatabase

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)
        
        database = AppDatabase.getInstance(this)
        appListRecyclerView = findViewById(R.id.app_list)
        appListRecyclerView.layoutManager = LinearLayoutManager(this)
        
        loadApps()
    }

    private fun loadApps() {
        lifecycleScope.launch {
            withContext(Dispatchers.IO) {
                val appLimits = database.appLimitDao().getAll()
                withContext(Dispatchers.Main) {
                    adapter = AppListAdapter(appLimits) { appLimit ->
                        val intent = Intent(this@SettingsActivity, EditAppLimitActivity::class.java).apply {
                            putExtra("packageName", appLimit.packageName)
                        }
                        startActivity(intent)
                    }
                    appListRecyclerView.adapter = adapter
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        loadApps()
    }
}
