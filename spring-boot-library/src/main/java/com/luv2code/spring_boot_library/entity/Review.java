package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Data
@Entity
@Table(name = "review",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uniqueUserBookReview",
                        columnNames = {"book_id", "user_id"}
                )
        }
)
public class Review {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "date")
    @CreationTimestamp
    private Date date;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "review_description")
    private String reviewDescription;
}
