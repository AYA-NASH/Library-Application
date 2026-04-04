package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private AppUser admin;

    @Column(name = "title")
    private String title;

    @Column(name = "question")
    private String question;

    @Column(name = "response")
    private String response;

    @Column(name = "closed")
    private boolean closed;
}
