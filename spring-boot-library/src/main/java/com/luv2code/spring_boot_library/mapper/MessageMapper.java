package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.MessageDtos;
import com.luv2code.spring_boot_library.entity.Message;
import com.luv2code.spring_boot_library.repository.UserRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    // 1. User posting a new message
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "response", ignore = true)
    @Mapping(target = "closed", constant = "false")
    @Mapping(target = "user", ignore = true)
    Message toEntity(MessageDtos.UserMessageRequest request, @Context UserRepository repository);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "closed", constant = "true")
    void updateEntityFromAdminResponse(MessageDtos.AdminMessageResponse adminResponse,  @MappingTarget Message message, @Context UserRepository repository);

    @AfterMapping
    default void linkUser(MessageDtos.UserMessageRequest request, @MappingTarget Message message, @Context UserRepository userRepository) {
        System.out.println("After Mapping gets called");
        System.out.println("Message Request: "+ request.toString());
        userRepository.findById(request.userId()).ifPresent(message::setUser);
    }

    @AfterMapping
    default void linkAdmin(MessageDtos.AdminMessageResponse adminResponse, @MappingTarget Message message, @Context UserRepository userRepository) {
        userRepository.findById(adminResponse.adminId()).ifPresent(message::setAdmin);
    }
}