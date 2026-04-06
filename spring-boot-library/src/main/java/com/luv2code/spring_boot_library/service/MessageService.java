package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.MessageDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.Message;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.mapper.MessageMapper;
import com.luv2code.spring_boot_library.repository.MessageRepository;
import com.luv2code.spring_boot_library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    @Transactional(readOnly = true)
    public Page<MessageDtos.MessageResponse> getUserMessages(Long userId, Pageable pageable) {
        return messageRepository.findByUserId(userId, pageable)
                .map(messageMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<MessageDtos.AdminMessageView> getOpenedQuestions(Pageable pageable) {
        return messageRepository.findByClosed(false, pageable)
                .map(messageMapper::toView);
    }

    public void postMessage(Long userId, MessageDtos.NewMessageRequest request) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Message message = messageMapper.toEntity(request, userRepository);
        message.setUser(user);

        messageRepository.save(message);
    }

    public void adminReply(Long adminId, MessageDtos.AdminReplyRequest adminReply) {
        Message foundMessage = messageRepository.findById(adminReply.messageId())
                .orElseThrow(() -> new ResourceNotFoundException("Message Not Found"));

        messageMapper.updateEntityFromReply(adminReply, foundMessage, userRepository);

        messageMapper.linkAdmin(adminReply, foundMessage, adminId, userRepository);

        messageRepository.save(foundMessage);
    }
}
