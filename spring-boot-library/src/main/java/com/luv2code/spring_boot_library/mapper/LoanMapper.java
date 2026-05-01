package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.entity.Checkout;
import com.luv2code.spring_boot_library.entity.History;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDate;

@Mapper(componentModel = "spring")
public interface LoanMapper {
    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "title", source = "book.title")
    @Mapping(target = "author", source = "book.author")
    @Mapping(target = "img", source = "book.img")
    @Mapping(target = "description", source = "book.description")
    @Mapping(target = "daysLeft", expression = "java(calculateDaysLeft(checkout.getReturnDate()))")
    LoanDtos.ShelfResponse toShelfResponse(Checkout checkout);

    default int calculateDaysLeft(LocalDate returnDate){
        if (returnDate == null) return 0;
        return (int) java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), returnDate);
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "checkoutDate", source = "checkoutDate")
    @Mapping(target = "returnedDate", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "title", source = "book.title")
    @Mapping(target = "author", source = "book.author")
    @Mapping(target = "description", source = "book.description")
    @Mapping(target = "img", source = "book.img")
    History toHistoryEntity(Checkout checkout);

}
