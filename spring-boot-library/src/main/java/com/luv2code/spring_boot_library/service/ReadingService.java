package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.DigitalReadHistory;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.mapper.BookMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.DigitalReadHistoryRepository;
import com.luv2code.spring_boot_library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReadingService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final UserRepository userRepository;
    private final DigitalReadHistoryRepository digitalReadHistoryRepository;

    @Transactional
    public BookDtos.DigitalAccessResponse getBookUrl(Long bookId, AppUser user) {
        // for now let's just stick with the user is authorized.
        // authorized user can reach to the content.
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        LocalDate today = LocalDate.now();
        boolean alreadyReadToday = digitalReadHistoryRepository
                .existsByUserIdAndBookIdAndReadDate(user.getId(), bookId, LocalDate.now());

        if (!alreadyReadToday) {
            DigitalReadHistory newReadRecord = new DigitalReadHistory();
            newReadRecord.setUser(user);
            newReadRecord.setBook(book);
            newReadRecord.setReadDate(today);

            digitalReadHistoryRepository.save(newReadRecord);
        }
        return bookMapper.toFullAccessResponse(book);
    }

    public BookDtos.DigitalAccessResponse getBookPreviewUrl(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        return bookMapper.toPreviewAccessResponse(book);
    }
}
