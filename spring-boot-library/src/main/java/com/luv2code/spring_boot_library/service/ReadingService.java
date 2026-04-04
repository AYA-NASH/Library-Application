package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.mapper.BookMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReadingService {

    private BookRepository bookRepository;
    private BookMapper bookMapper;

    @Autowired
    public ReadingService(BookRepository bookRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
    }

    public BookDtos.DigitalAccessResponse getBookUrl(Long bookId) throws Exception {
        // for now let's just stick with the user is authorized.
        // authorized user can reach to the content.
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        return bookMapper.toFullAccessResponse(book);
    }

    public BookDtos.DigitalAccessResponse getBookPreviewUrl(Long bookId) throws Exception {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        return bookMapper.toPreviewAccessResponse(book);
    }
}
