package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.dto.projection.DateCountProjection;
import com.luv2code.spring_boot_library.entity.DigitalReadHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DigitalReadHistoryRepository extends JpaRepository<DigitalReadHistory, Long> {
    @Query("SELECT d.readDate AS date, COUNT(d.id) AS count " +
            "FROM DigitalReadHistory d " +
            "WHERE d.readDate BETWEEN :startDate AND :endDate " +
            "GROUP BY d.readDate"
    )
    List<DateCountProjection> countDigitalReadsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    boolean existsByUserIdAndBookIdAndReadDate(Long userId, Long bookId, LocalDate readDate);
}
