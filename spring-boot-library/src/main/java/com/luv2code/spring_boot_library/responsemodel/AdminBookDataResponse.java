package com.luv2code.spring_boot_library.responsemodel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminBookDataResponse {
    private String title;
    private String author;
    private String description;
    private Integer copies;
    private Set<Long> categoryIds;
}


/*
*     id: number;
    title: string;
    author?: string;
    description?: string;
    copies?: number;
    copiesAvailable?: number;
    categoryIds?: number[];
    dataSource: string;
    img?:string;
* */