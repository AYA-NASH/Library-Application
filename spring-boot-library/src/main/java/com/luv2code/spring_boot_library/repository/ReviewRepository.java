package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByBookId(Long bookId, Pageable pageable);

    Review findByUserIdAndBookId(Long userId, Long bookId);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    @Modifying
    @Query("delete from Review r where r.book.id = :bookId")
    void deleteAllByBookId(@Param("bookId") Long bookId);
}
