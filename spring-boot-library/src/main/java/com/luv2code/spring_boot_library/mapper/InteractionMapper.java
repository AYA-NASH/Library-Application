package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.InteractionDtos;
import com.luv2code.spring_boot_library.entity.UserBookInteraction;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.UserRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InteractionMapper {

    @Mapping(target = "lastPage", source = "request.page")
    @Mapping(target = "user", expression = "java(userRepo.getReferenceById(userId))")
    @Mapping(target = "book", expression = "java(bookRepo.getReferenceById(bookId))")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lastOpenedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
    UserBookInteraction createEntity(Long userId, Long bookId, InteractionDtos.ProgressRequest request,
                                     @Context UserRepository userRepo, @Context BookRepository bookRepo);

    @Mapping(target = "lastPage", source = "page")
    @Mapping(target = "lastOpenedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
    void updateEntity(InteractionDtos.ProgressRequest request,
                      @MappingTarget UserBookInteraction entity);

    @Mapping(target = "page", source = "lastPage")
    InteractionDtos.ProgressResponse toResponse(UserBookInteraction entity);
}
