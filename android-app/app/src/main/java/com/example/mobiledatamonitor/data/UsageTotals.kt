package com.example.mobiledatamonitor.data

data class UsageTotals(
    val mobileRxBytes: Long,
    val mobileTxBytes: Long,
    val wifiRxBytes: Long,
    val wifiTxBytes: Long,
    val startTimeMillis: Long,
    val endTimeMillis: Long
) {
    val mobileTotalBytes: Long get() = mobileRxBytes + mobileTxBytes
    val wifiTotalBytes: Long get() = wifiRxBytes + wifiTxBytes
    val overallTotalBytes: Long get() = mobileTotalBytes + wifiTotalBytes
}
