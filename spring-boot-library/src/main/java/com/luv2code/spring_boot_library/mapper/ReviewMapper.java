package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.ReviewDto;
import com.luv2code.spring_boot_library.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "reviewDescription", expression = "java(request.reviewDescription().orElse(null))")
    Review toEntity(ReviewDto.ReviewRequest request);

    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "bookId", source = "book.id")
    ReviewDto.ReviewResponse toReviewResponse(Review entity);

}
