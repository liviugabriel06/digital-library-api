package com.example.digitallibrary.controller;

import com.example.digitallibrary.model.Book;
import com.example.digitallibrary.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // GET cu filtre optionale
    // Exemplu URL: /books?author=Rowling sau /books?year=2000 sau /books?available=true
    @GetMapping
    public List<Book> getAllBooks(
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Boolean available
    ) {
        if (author != null) {
            return bookService.filterByAuthor(author);
        }
        if (title != null){
            return bookService.filterByTitle(title);
        }
        if (genre != null) {
            return bookService.filterByGenre(genre);
        }
        if (year != null) {
            return bookService.filterByYear(year);
        }
        if (Boolean.TRUE.equals(available)) {
            return bookService.getAvailableBooks();
        }
        // Daca nu e niciun filtru, le dam pe toate
        return bookService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- ENDPOINTURI DE ADMIN (Protejate de SecurityConfig) ---

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.addBook(book));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}