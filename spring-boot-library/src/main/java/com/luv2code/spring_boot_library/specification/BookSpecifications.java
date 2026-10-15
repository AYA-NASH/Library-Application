package com.luv2code.spring_boot_library.specification;

import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.BookSource;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class BookSpecifications {

    public static Specification<Book> withFilters(
            String text,
            Long categoryId,
            String status,
            String dataSource
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Text search across title or author
            if (StringUtils.hasText(text)) {
                String pattern = "%" + text.trim().toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), pattern);
                Predicate authorPredicate = cb.like(cb.lower(root.get("author")), pattern);
                predicates.add(cb.or(titlePredicate, authorPredicate));
            }

            // 2. Category filter
            if (categoryId != null && categoryId > 0) {
                predicates.add(cb.equal(root.join("categories").get("id"), categoryId));
            }

            // 3. Status filter: AVAILABLE vs OUT_OF_STOCK
            if (StringUtils.hasText(status) && !"all".equalsIgnoreCase(status)) {
                if ("AVAILABLE".equalsIgnoreCase(status)) {
                    predicates.add(cb.greaterThan(root.get("copiesAvailable"), 0));
                } else if ("OUT_OF_STOCK".equalsIgnoreCase(status)) {
                    predicates.add(cb.or(
                            cb.isNull(root.get("copiesAvailable")),
                            cb.equal(root.get("copiesAvailable"), 0)
                    ));
                }
            }

            // 4. Data source filter: INTERNAL vs GOOGLE
            if (StringUtils.hasText(dataSource) && !"all".equalsIgnoreCase(dataSource)) {
                try {
                    BookSource source = BookSource.valueOf(dataSource.toUpperCase());
                    predicates.add(cb.equal(root.get("dataSource"), source));
                } catch (IllegalArgumentException ignored) {
                    // Ignore unrecognized source
                }
            }

            if (query != null) {
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

