package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.entity.ActivityLog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityLogMapper {
    ActivityLog toEntity(DashboardDtos.RecentActivity dto);

    DashboardDtos.RecentActivity toDto(ActivityLog entity);
}
