package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.Category;
import com.luv2code.spring_boot_library.repository.CategoryRepository;
import org.mapstruct.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CategoryMapper.class}
)
public interface BookMapper {

    @Mapping(source = "img", target = "imgUrl")
    BookDtos.BookResponse toResponse(Book book);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(source = "copies", target = "copiesAvailable")
    Book toEntity(BookDtos.AdminBookRequest adminBookRequest, @Context CategoryRepository categoryRepository);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "img", ignore = true)
    @Mapping(target = "copiesAvailable", ignore = true)
    void updateEntityFromDto(BookDtos.AdminBookRequest dto, @MappingTarget Book entity, @Context CategoryRepository categoryRepository);

    @AfterMapping
    default void syncCategories(BookDtos.AdminBookRequest dto, @MappingTarget Book entity, @Context CategoryRepository categoryRepository) {
        Set<Long> ids = dto.categoryIds();

        if (ids == null || ids.isEmpty()) return;

        List<Category> foundCategories = categoryRepository.findAllById(ids);

        if (foundCategories.size() != ids.size()) {
            throw new IllegalArgumentException("One or more category IDs are invalid");
        }

        new HashSet<>(entity.getCategories()).forEach(entity::removeCategory);
        foundCategories.forEach(entity::addCategory);
    }

    @Mapping(target = "hasPdf", expression = "java(book.getBookUrl() != null)")
    @Mapping(target = "hasImage", expression = "java(book.getImg() != null)")
    @Mapping(target = "imageUrl", source = "img")
    @Mapping(target = "pdfFilename", source = "bookUrl", qualifiedByName = "urlToFilename")
    @Mapping(target = "imageFilename", source = "img", qualifiedByName = "urlToFilename")
    BookDtos.BookFileMetadata toEditInfoResponse(Book book);


    @Mapping(target = "url", source = "bookUrl")
    @Mapping(target = "source", expression = "java(book.getDataSource().toString())")
    @Mapping(target = "mode", constant = "full")
    BookDtos.DigitalAccessResponse toFullAccessResponse(Book book);

    @Mapping(target = "url", expression = "java(book.getPreviewUrl() != null && !book.getPreviewUrl().isBlank() ? book.getPreviewUrl() : book.getBookUrl())")
    @Mapping(target = "source", expression = "java(book.getDataSource().toString())")
    @Mapping(target = "mode", constant = "preview")
    BookDtos.DigitalAccessResponse toPreviewAccessResponse(Book book);

    @Named("urlToFilename")
    default String filenameFromUrl(String url) {
        if (url == null || url.isBlank()) return null;
        int last = url.lastIndexOf('/');
        if (last >= 0 && last < url.length() - 1) {
            String segment = url.substring(last + 1);
            int q = segment.indexOf('?');
            return q > 0 ? segment.substring(0, q) : segment;
        }
        return "file";
    }
}