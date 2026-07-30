package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.dto.BookDtos.BookResponse;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.mapper.BookMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookCatalogService {
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public Page<BookResponse> getBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(bookMapper::toResponse);
    }

    public BookResponse getBookById(Long bookId){
        return bookRepository.findById(bookId)
                .map(bookMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No book found with ID: " + bookId));
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

    public BookDtos.BookSummaryResponse getBookSummary() {
        long totalTitles = bookRepository.count();
        long totalPhysicalCopies = bookRepository.countTotalPhysicalCopies();
        long digitalBooks = bookRepository.countDigitalBooks();
        long outOfStock = bookRepository.countOutOfStockBooks();

        return new BookDtos.BookSummaryResponse(
                totalTitles,
                totalPhysicalCopies,
                digitalBooks,
                outOfStock
        );
    }
}
