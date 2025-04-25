package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.*;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name="review")
@Data
public class Review {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "date")
    @CreationTimestamp
    private Date date;

    @Column(name = "rate")
    private Double rate;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "review_description")
    private String reviewDescription;
}
