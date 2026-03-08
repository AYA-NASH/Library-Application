package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.requestmodel.AdminBookRequest;
import com.luv2code.spring_boot_library.responsemodel.AdminBookEditInfoResponse;
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

    @GetMapping("/secure/book/{bookId}/edit-info")
    public ResponseEntity<AdminBookEditInfoResponse> getBookEditInfo(@PathVariable Long bookId) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Access denied: Administration page only.");
        }

        AdminBookEditInfoResponse response = adminService.getBookEditInfo(bookId);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/secure/add/book", consumes = "multipart/form-data")
    public ResponseEntity<?> postBook(
            @ModelAttribute AdminBookRequest request,
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Access denied: Administration page only.");
        }

        adminService.postBook(request, image, pdf);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/secure/update/book/data/{bookId}", consumes = "multipart/form-data")
    public ResponseEntity<Void> updateBook(
            @PathVariable Long bookId,
            @ModelAttribute AdminBookRequest request,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) MultipartFile pdf,
            @RequestParam(value = "removeImage", required = false) Boolean removeImage,
            @RequestParam(value = "removePdf", required = false) Boolean removePdf) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Access denied: Administration page only.");
        }

        adminService.updateBookData(bookId, request, image, pdf,
                Boolean.TRUE.equals(removeImage),
                Boolean.TRUE.equals(removePdf));

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
