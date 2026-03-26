package com.luv2code.spring_boot_library.responsemodel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String description;
    private String imgUrl;
    private Set<BookCategory> categories;

    public record BookCategory(Long id, String name) {
    }

}

