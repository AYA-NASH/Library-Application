package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.event.ActivityOccurredEvent;
import com.luv2code.spring_boot_library.mapper.ActivityLogMapper;
import com.luv2code.spring_boot_library.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogMapper activityLogMapper;

    @Async
    @EventListener
    public void recordActivity(ActivityOccurredEvent event) {
        activityLogRepository.save(activityLogMapper.toEntity(event.activity()));
    }

    public List<DashboardDtos.RecentActivity> getRecentHistory() {
        return activityLogRepository.findTop50ByOrderByTimestampDesc()
                .stream()
                .map(activityLogMapper::toDto)
                .collect(Collectors.toList());
    }
}
