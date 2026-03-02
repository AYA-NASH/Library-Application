package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.responsemodel.DigitalAccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReadingService {

    private BookRepository bookRepository;

    @Autowired
    public ReadingService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    public DigitalAccessResponse getBookUrl(Long bookId) throws Exception {
        // for now let's just stick with the user is authorized.
        // authorized user can reach to the content.
       Book book = bookRepository.findById(bookId)
          .orElseThrow(() -> new Exception("Book not found"));
          
        String bookUrl = book.getBookUrl();
        String bookSource = book.getDataSource().toString();
        return new DigitalAccessResponse(bookUrl, bookSource, "full");
    }

    public DigitalAccessResponse getBookPreviewUrl(Long bookId) throws Exception{
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        String previewUrl = book.getPreviewUrl();
        if (previewUrl == null || previewUrl.isBlank()) {
            previewUrl = book.getBookUrl();
        }

        String bookSource = book.getDataSource().toString();
        return new DigitalAccessResponse(previewUrl, bookSource, "preview");
    }
}
