package com.luv2code.spring_boot_library.requestmodel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminBookRequest {
    private String title;
    private String author;
    private String description;
    private Integer copies;
    private String category;
}
