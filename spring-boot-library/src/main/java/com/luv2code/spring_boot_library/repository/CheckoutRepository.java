package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Optional<Checkout> findByUserEmailAndBookId(String email, Long bookId);

    // Fetch all checked out books by a user.
    @Query("SELECT c FROM Checkout c " +
            "JOIN FETCH c.book " +
            "WHERE c.user.email = :email")
    List<Checkout> findAllByUserEmailWithBooks(@Param("email") String email);

//    List<Checkout> findCheckoutsByUserEmail(String userEmail);

    // Count checkouts done by a specific user.
    int countByUserEmail(String email);

    // Check if any book is overdue without fetching the list
    boolean existsByUserEmailAndReturnDateBefore(String email, LocalDate now);

    @Modifying
    @Query("delete from Checkout c where c.book.id = :bookId")
    void deleteAllByBookId(@RequestParam("bookId") Long bookId);
}
