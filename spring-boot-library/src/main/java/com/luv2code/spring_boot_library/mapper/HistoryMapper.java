package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.entity.History;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HistoryMapper {
    @Mapping(target = "userEmail", source = "user.email")
    LoanDtos.HistoryResponse toHistoryResponse(History history);
}
