package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.InteractionDtos;
import com.luv2code.spring_boot_library.entity.UserBookInteraction;
import com.luv2code.spring_boot_library.mapper.InteractionMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.UserBookInteractionRepository;
import com.luv2code.spring_boot_library.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserBookInteractionService {
    private final InteractionMapper interactionMapper;
    private final UserBookInteractionRepository userBookInteractionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

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
