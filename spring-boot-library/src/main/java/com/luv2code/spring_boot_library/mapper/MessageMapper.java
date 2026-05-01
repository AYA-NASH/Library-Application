package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.MessageDtos;
import com.luv2code.spring_boot_library.entity.Message;
import com.luv2code.spring_boot_library.repository.UserRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "response", ignore = true)
    @Mapping(target = "closed", constant = "false")
    @Mapping(target = "user", ignore = true)
    Message toEntity(MessageDtos.NewMessageRequest request, @Context UserRepository repository);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "closed", constant = "true")
    void updateEntityFromReply(MessageDtos.AdminReplyRequest adminReply, @MappingTarget Message message, @Context UserRepository repository);

    @Mapping(target = "adminName", source = "admin.username")
    @Mapping(target = "adminResponse", source = "response")
    MessageDtos.MessageResponse toResponse(Message entity);

    @Mapping(target = "userEmail", source = "user.email")
    MessageDtos.AdminMessageView toView(Message entity);

    @AfterMapping
    default void linkAdmin(MessageDtos.AdminReplyRequest adminReply, @MappingTarget Message message, @Context Long adminId, @Context UserRepository userRepository) {
        userRepository.findById(adminId).ifPresent(message::setAdmin);
    }
}