package com.luv2code.spring_boot_library.dao;

import com.luv2code.spring_boot_library.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Checkout findByUserEmailAndBookId(String userEmail, Long BookId);
    List<Checkout> findCheckoutsByUserEmail(String userEmail);
}
