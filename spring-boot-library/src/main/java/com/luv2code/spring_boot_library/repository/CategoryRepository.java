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

    @Query("SELECT COUNT(c) FROM Category c")
    long countTotalCategories();

    @Query("SELECT COUNT(c) FROM Category c WHERE SIZE(c.books) = 0")
    long countEmptyCategories();

    @Query("SELECT c.name, COUNT(b) " +
            "FROM Category c " +
            "JOIN c.books b " +
            "GROUP BY c.id, c.name " +
            "ORDER BY COUNT(b) DESC LIMIT 1"
    )
    List<Object[]> findLargestCategory();

    @Query(value = "SELECT AVG(book_count) " +
            "FROM " +
            "(SELECT COUNT(book_id) as book_count FROM book_category GROUP BY category_id) as counts"
            , nativeQuery = true)
    Double findAverageBooksPerCategory();

    @Query("SELECT COUNT(b) FROM Book b WHERE SIZE(b.categories) = 0")
    long countUncategorizedBooks();
}
