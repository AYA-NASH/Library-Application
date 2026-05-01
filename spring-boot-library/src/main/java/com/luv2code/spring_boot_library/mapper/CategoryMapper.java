package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.CategoryDto;
import com.luv2code.spring_boot_library.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    Category toEntity(CategoryDto.CreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "books", ignore = true)
    void updateEntityFromDto(CategoryDto.CreateRequest dto, @MappingTarget Category entity);

    @Mapping(target = "booksCount", expression = "java(category.getBooks() != null ? category.getBooks().size() : 0)")
    CategoryDto.DetailsResponse toDetailsResponse(Category category);

    CategoryDto.Reference toCategoryReference(Category category);
}