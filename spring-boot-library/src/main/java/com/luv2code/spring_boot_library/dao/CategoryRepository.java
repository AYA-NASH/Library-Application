package com.luv2code.spring_boot_library.dao;

import com.luv2code.spring_boot_library.entity.Category;
import com.luv2code.spring_boot_library.responsemodel.CategoryResponse;
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

    @Query("SELECT new com.luv2code.spring_boot_library.responsemodel.CategoryResponse(c.id, c.name, COUNT(b)) " +
            "FROM Category c LEFT JOIN c.books b " +
            "GROUP BY c.id, c.name")
    List<CategoryResponse> findAllWithCount();
}
