package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/secure/update/book/quantity")
    public void updateBookQuantity(
            @RequestParam Long bookId,
            @RequestParam int quantity
    ) throws Exception {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Access denied: Administration page only.");
        }

        adminService.updateBookQuantity(bookId, quantity);
    }

    @PostMapping(value="/secure/add/book",
                consumes = "multipart/form-data")
    public void postBook( @RequestParam String title,
                          @RequestParam String author,
                          @RequestParam String description,
                          @RequestParam int copies,
                          @RequestParam String category,
                          @RequestParam("image") MultipartFile image
                         ) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Access denied: Administration page only.");
        }

        adminService.postBook(
                title,
                author,
                description,
                copies,
                category,
                image
        );
    }

    @PutMapping("/secure/update/book/data/{bookId}")
    public ResponseEntity<Void> updateBook(
            @PathVariable Long bookId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Access denied: Administration page only.");
        }

        adminService.updateBookData(bookId, title, author, description, category, image);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestParam Long bookId) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Access denied: Administration page only.");
        }

        adminService.deleteBook(bookId);
    }
}
