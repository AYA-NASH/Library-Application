package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByUserEmail(String userEmail);

    Optional<Payment> findByUserId(Long userId);

    Page<Payment> findAllByLateFeesGreaterThan(Long lateFees, Pageable pageable);
}
