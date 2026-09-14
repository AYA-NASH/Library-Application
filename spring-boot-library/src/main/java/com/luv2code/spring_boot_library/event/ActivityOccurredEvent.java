package com.luv2code.spring_boot_library.event;

import com.luv2code.spring_boot_library.dto.DashboardDtos.RecentActivity;

public record ActivityOccurredEvent(RecentActivity activity) {
}
