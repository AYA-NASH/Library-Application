package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.InteractionDtos;
import com.luv2code.spring_boot_library.entity.UserBookInteraction;
import com.luv2code.spring_boot_library.mapper.InteractionMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.UserBookInteractionRepository;
import com.luv2code.spring_boot_library.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserBookInteractionService {
    private final InteractionMapper interactionMapper;
    private UserBookInteractionRepository userBookInteractionRepository;
    private UserRepository userRepository;
    private BookRepository bookRepository;

    @Autowired
    public UserBookInteractionService(UserBookInteractionRepository userBookInteractionRepository,
                                      UserRepository userRepository,
                                      BookRepository bookRepository,
                                      InteractionMapper interactionMapper) {
        this.userBookInteractionRepository = userBookInteractionRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.interactionMapper = interactionMapper;
    }

    public Integer getLastReadPage(Long userId, Long bookId) {
        return userBookInteractionRepository
                .findByUserIdAndBookId(userId, bookId)
                .map(UserBookInteraction::getLastPage)
                .orElse(1);
    }

    public void updateLastReadPage(Long userId, Long bookId, InteractionDtos.ProgressRequest request) {
        UserBookInteraction interaction = userBookInteractionRepository.findByUserIdAndBookId(userId, bookId)
                .map(existing -> {
                    interactionMapper.updateEntity(request, existing);
                    return existing;
                })
                .orElseGet(() -> interactionMapper.createEntity(userId, bookId, request, userRepository, bookRepository));

        userBookInteractionRepository.save(interaction);
    }

}
