package com.ij11.chatbot.api.dto.system;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HardwareStats {
    double processCPUUsage;
    long totalMemoryMiB;
    long freeMemoryMiB;
    long totalSwapMiB;
    long freeSwapMiB;
    long totalDiskSpaceMiB;
    long freeDiskSpaceMiB;
    long systemUptimeSeconds;
}
