package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.entity.History;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HistoryMapper {
    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "title", source = "book.title")
    @Mapping(target = "author", source = "book.author")
    @Mapping(target = "description", source = "book.description")
    @Mapping(target = "img", source = "book.img")
    LoanDtos.HistoryResponse toHistoryResponse(History history);
}
