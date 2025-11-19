package com.luv2code.spring_boot_library.dao;

import com.luv2code.spring_boot_library.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Integer> {
    boolean existsByEmail(String email);
    AppUser findByUsername(String username);
    AppUser findByEmail(String email);
}
