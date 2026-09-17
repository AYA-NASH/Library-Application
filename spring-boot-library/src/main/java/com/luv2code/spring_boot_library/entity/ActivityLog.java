package com.luv2code.spring_boot_library.entity;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "activity_log")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_category")
    private DashboardDtos.EventCategory category;

    @Enumerated(EnumType.STRING)
    private DashboardDtos.ActionType actionType;

    private String actor;
    private String target;

    @Column(name = "created_at")
    private LocalDateTime timestamp;
}
