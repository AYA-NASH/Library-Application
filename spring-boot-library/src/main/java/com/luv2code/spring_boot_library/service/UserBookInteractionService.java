package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.dao.UserBookInteractionRepository;
import com.luv2code.spring_boot_library.dao.UserRepository;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.UserBookInteraction;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Transactional
public class UserBookInteractionService {
    private UserBookInteractionRepository userBookInteractionRepository;
    private UserRepository userRepository;
    private BookRepository bookRepository;

    @Autowired
    public UserBookInteractionService(UserBookInteractionRepository userBookInteractionRepository,
                                      UserRepository userRepository,
                                      BookRepository bookRepository){
        this.userBookInteractionRepository = userBookInteractionRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public Integer getLastReadPage(Long userId, Long bookId)  {
        return userBookInteractionRepository
                .findByUserIdAndBookId(userId, bookId)
                .map(UserBookInteraction::getLastPage)
                .orElse(1);
    }

    public void updateLastReadPage(Long userId, Long bookId, Integer page) {
        UserBookInteraction interaction = userBookInteractionRepository
                .findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> {
                    UserBookInteraction newInteraction = new UserBookInteraction();
                    newInteraction.setUser(userRepository.getReferenceById(userId));
                    newInteraction.setBook(bookRepository.getReferenceById(bookId));
                    return newInteraction;
                });

        interaction.setLastPage(page);
        interaction.setLastOpenedAt(LocalDateTime.now());
        interaction.setUpdatedAt(LocalDateTime.now());

        userBookInteractionRepository.save(interaction);
    }

}
