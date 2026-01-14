package com.example.mobiledatamonitor

import android.content.Context
import android.content.pm.PackageManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class AppListAdapter(
    private var appLimits: List<AppLimit>,
    private val onItemClick: (AppLimit) -> Unit
) : RecyclerView.Adapter<AppListAdapter.AppViewHolder>() {

    class AppViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val appName: TextView = itemView.findViewById(R.id.app_name)
        val timeLimit: TextView = itemView.findViewById(R.id.time_limit)
        val whitelistCheckbox: CheckBox = itemView.findViewById(R.id.whitelist_checkbox)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AppViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_app_limit, parent, false)
        return AppViewHolder(view)
    }

    override fun onBindViewHolder(holder: AppViewHolder, position: Int) {
        val appLimit = appLimits[position]
        val packageManager = holder.itemView.context.packageManager
        
        try {
            val appInfo = packageManager.getApplicationInfo(appLimit.packageName, 0)
            holder.appName.text = packageManager.getApplicationLabel(appInfo)
        } catch (e: PackageManager.NameNotFoundException) {
            holder.appName.text = appLimit.packageName
        }
        
        holder.timeLimit.text = "${appLimit.timeLimit / (60 * 1000)} minutos"
        holder.whitelistCheckbox.isChecked = appLimit.isWhitelisted
        
        holder.itemView.setOnClickListener { onItemClick(appLimit) }
    }

    override fun getItemCount() = appLimits.size

    fun updateList(newList: List<AppLimit>) {
        appLimits = newList
        notifyDataSetChanged()
    }
}
