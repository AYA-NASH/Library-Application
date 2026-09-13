package com.luv2code.spring_boot_library.dto.projection;

public interface BookReadCountProjection {
    Long getBookId();

    String getTitle();

    String getAuthor();

    Long getCount();
}
