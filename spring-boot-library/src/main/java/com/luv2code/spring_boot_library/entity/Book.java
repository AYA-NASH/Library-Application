package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name ="title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "category")
    private String category;

    @Column(name = "copies")
    private Integer copies;

    @Column(name = "copies_available")
    private Integer copiesAvailable;

    @Column(name = "description")
    private String description;

    @Column(name = "img_url")
    private String img;

    @Column(name="image_public_id")
    private String imagePublicId;

    @Enumerated(EnumType.STRING)
    @Column(name="book_source", nullable = false)
    private BookSource dataSource;

    @Column(name="book_url")
    private String bookUrl;

    @Column(name="pdf_public_id")
    private String pdfPublicId;

    @Column(name="preview_url")
    private String previewUrl;
}
