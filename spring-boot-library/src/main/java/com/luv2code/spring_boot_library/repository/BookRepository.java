package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByTitleContaining(String title, Pageable pageable);

    Page<Book> findByCategories_Id(Long categoryId, Pageable pageable);


    Page<Book> findByCategories_IdIn(@Param("categoryIds") List<Long> categoryIds, Pageable pageable);

    long count();

    @Query("SELECT COALESCE(SUM(b.copies), 0) FROM Book b")
    long countTotalPhysicalCopies();

    @Query("SELECT COUNT(b) FROM Book b WHERE(b.pdfPublicId IS NOT NULL AND b.pdfPublicId <> '')")
    long countDigitalBooks();

    @Query("SELECT COUNT(b) FROM Book b WHERE b.copiesAvailable = 0 OR b.copiesAvailable IS NULL")
    long countOutOfStockBooks();

    @Query("SELECT COUNT(b.id) FROM Book b " +
            "WHERE b.copiesAvailable <= :min AND b.copiesAvailable > 0")
    long countLowStockBooks(@Param("min") int min);

    @Query("SELECT COUNT(b.id) FROM Book b " +
            "WHERE b.pdfPublicId IS NULL AND b.copies > 0")
    long countPhysical();

    @Query("SELECT COUNT(b.id) FROM Book b " +
            "WHERE b.copies IS NULL AND b.pdfPublicId IS NOT NULL")
    long countDigital();

    @Query("SELECT COUNT(b.id) FROM Book b " +
            "WHERE b.pdfPublicId IS NOT NULL AND b.copies > 0")
    long countHybrid();

    @Query("SELECT COALESCE(SUM(b.copiesAvailable), 0) FROM Book b")
    long sumAvailableCopies();

    @Query("SELECT COALESCE(SUM(b.copies), 0) FROM Book b")
    long sumTotalCopies();
}
