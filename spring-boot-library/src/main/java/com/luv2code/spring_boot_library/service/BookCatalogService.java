package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.BookDtos.BookResponse;
import com.luv2code.spring_boot_library.mapper.BookMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookCatalogService {
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @Autowired
    public BookCatalogService(BookRepository bookRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;

    }

    public Page<BookResponse> getBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(bookMapper::toResponse);
    }

    public BookResponse getBookById(Long bookId) throws Exception {
        return bookRepository.findById(bookId)
                .map(bookMapper::toResponse)
                .orElseThrow(() -> new Exception("Book Not Found"));
    }

    public Page<BookResponse> searchBooksByTitle(String title, Pageable pageable) {
        return bookRepository.findByTitleContaining(title, pageable)
                .map(bookMapper::toResponse);
    }

    public Page<BookResponse> searchBooksByCategoryId(Long categoryId, Pageable pageable) {
        return bookRepository.findByCategories_Id(categoryId, pageable)
                .map(bookMapper::toResponse);
    }

    public Page<BookResponse> getBooksByCategories(List<Long> categoryIds, Pageable pageable) {
        return bookRepository.findByCategories_IdIn(categoryIds, pageable)
                .map(bookMapper::toResponse);
    }
}
