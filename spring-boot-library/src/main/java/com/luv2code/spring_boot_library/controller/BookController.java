package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam("bookId") Long bookId) throws Exception{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return bookService.checkoutBook(userEmail, bookId);
    }

    @GetMapping("/secure/current-loans/count")
    public int currentLoansCount(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return bookService.countCheckouts(userEmail);
    }

    @GetMapping("/secure/is-checked-out/byuser")
    public boolean isBookCheckedOutByUser(@RequestParam("bookId") Long bookId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return bookService.isBookCheckedOutByUser(authentication.getName(), bookId);
    }
}
