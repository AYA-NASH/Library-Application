package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.mapper.BookMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReadingService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public BookDtos.DigitalAccessResponse getBookUrl(Long bookId) {
        // for now let's just stick with the user is authorized.
        // authorized user can reach to the content.
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        return bookMapper.toFullAccessResponse(book);
    }

    public BookDtos.DigitalAccessResponse getBookPreviewUrl(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        return bookMapper.toPreviewAccessResponse(book);
    }
}
