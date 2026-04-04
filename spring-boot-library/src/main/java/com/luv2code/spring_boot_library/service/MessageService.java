package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.MessageDtos;
import com.luv2code.spring_boot_library.entity.Message;
import com.luv2code.spring_boot_library.mapper.MessageMapper;
import com.luv2code.spring_boot_library.repository.MessageRepository;
import com.luv2code.spring_boot_library.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    public void postMessage(MessageDtos.UserMessageRequest request) {
        Message message = messageMapper.toEntity(request, userRepository);
        messageRepository.save(message);
    }

    public void putMessage(MessageDtos.AdminMessageResponse adminResponse) {
        Message foundMessage = messageRepository.findById(adminResponse.messageId())
                .orElseThrow(() -> new RuntimeException("Message Not Found"));
        messageMapper.updateEntityFromAdminResponse(adminResponse, foundMessage, userRepository);

        messageRepository.save(foundMessage);
    }
}
