package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT COUNT(b) FROM Book b JOIN b.categories c WHERE c.id = :categoryId")
    long countBooksByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.books")
    List<Category> findAllWithBooks();
}
