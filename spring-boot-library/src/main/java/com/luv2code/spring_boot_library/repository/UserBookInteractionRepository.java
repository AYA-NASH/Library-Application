package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.UserBookInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserBookInteractionRepository extends JpaRepository<UserBookInteraction, Long> {
    Optional<UserBookInteraction> findByUserIdAndBookId(Long userId, Long bookId);
}
