package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.dto.projection.CategoryCountProjection;
import com.luv2code.spring_boot_library.dto.projection.DateCountProjection;
import com.luv2code.spring_boot_library.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    Page<History> findBooksByUserId(Long userId, Pageable pageable);

    @Query("SELECT h.checkoutDate AS date, COUNT(h.id) AS count " +
            "FROM History h " +
            "WHERE h.checkoutDate BETWEEN :startDate AND :endDate " +
            "GROUP BY h.checkoutDate")
    List<DateCountProjection> countPhysicalBorrowsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(value = "SELECT c.name AS category, COUNT(h.id) AS count " +
            "FROM history h "+
            "JOIN book_category bc ON h.book_id = bc.book_id " +
            "JOIN category c ON c.id = bc.category_id "+
            "WHERE h.checkout_date BETWEEN :startDate AND :endDate "+
            "GROUP BY c.name"
            , nativeQuery = true)
    List<CategoryCountProjection> findPhysicalCategoryTrends(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
