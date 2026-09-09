package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.Checkout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;


@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Optional<Checkout> findByUserEmailAndBookId(String email, Long bookId);

    // Fetch all checked out books by a user.
    @Query("SELECT c FROM Checkout c " +
            "JOIN FETCH c.book " +
            "WHERE c.user.email = :email")
    Page<Checkout> findAllByUserEmailWithBooks(@Param("email") String email, Pageable pageable);

//    List<Checkout> findCheckoutsByUserEmail(String userEmail);

    // Count checkouts done by a specific user.
    int countByUserEmail(String email);

    // Check if any book is overdue without fetching the list
    boolean existsByUserEmailAndReturnDateBefore(String email, LocalDate now);

    long count();

    boolean existsByBookId(Long bookId);

    @Query("SELECT COUNT(c.id) " +
            "FROM Checkout c " +
            "WHERE CURRENT_DATE > c.returnDate")
    long countOverdueLoans();
}
