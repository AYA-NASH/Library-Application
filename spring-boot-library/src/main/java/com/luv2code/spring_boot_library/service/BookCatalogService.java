package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.responsemodel.BookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookCatalogService {
    private final BookRepository bookRepository;

    @Autowired
    public BookCatalogService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;

    }

    public Page<BookResponse> getBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(this::mapToBookResponse);
    }

    public BookResponse getBookById(Long bookId) throws Exception {
        return bookRepository.findById(bookId)
                .map(this::mapToBookResponse)
                .orElseThrow(() -> new Exception("Book Not Found"));
    }

    public Page<BookResponse> searchBooksByTitle(String title, Pageable pageable) {
        return bookRepository.findByTitleContaining(title, pageable)
                .map(this::mapToBookResponse);
    }

    public Page<BookResponse> searchBooksByCategoryId(Long categoryId, Pageable pageable) {
        Page<Book> books = bookRepository.findByCategories_Id(categoryId, pageable);
        return books.map(this::mapToBookResponse);
    }

    public Page<BookResponse> getBooksByCategories(List<Long> categoryIds, Pageable pageable) {
        return bookRepository.findByCategories_IdIn(categoryIds, pageable)
                .map(this::mapToBookResponse);
    }


    private BookResponse mapToBookResponse(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                book.getImg(),
                book.getCategories().stream()
                        .map(category -> new BookResponse.BookCategory(
                                category.getId(),
                                category.getName()
                        ))
                        .collect(Collectors.toSet())
        );
    }
}
