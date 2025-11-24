package com.example.digitallibrary.service;

import com.example.digitallibrary.model.Book;
import com.example.digitallibrary.model.BorrowRecord;
import com.example.digitallibrary.repository.BookRepository;
import com.example.digitallibrary.repository.BorrowRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public BookService(BookRepository bookRepository, BorrowRecordRepository borrowRecordRepository) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    // Metode de filtrare cerute de tine
    public List<Book> filterByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    public List<Book> filterByGenre(String genre) {
        return bookRepository.findByGenreIgnoreCase(genre);
    }

    public List<Book> filterByYear(Integer year) {
        return bookRepository.findByPublicationYear(year);
    }

    public List<Book> getAvailableBooks() {
        return bookRepository.findByAvailableCopiesGreaterThan(0);
    }

    // --- DOAR PENTRU ADMIN (vom restrictiona in Controller) ---

    public Book addBook(Book book) {
        // La inceput, copiile disponibile sunt egale cu cele totale
        book.setAvailableCopies(book.getTotalCopies());
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setGenre(bookDetails.getGenre());
        book.setPublicationYear(bookDetails.getPublicationYear());
        book.setBookNumber(bookDetails.getBookNumber());

        // Logica stoc: Daca adminul schimba stocul total, trebuie ajustat si cel disponibil
        // (Asta e o simplificare, in realitate e mai complex daca stocul scade sub ce e imprumutat)
        int diff = bookDetails.getTotalCopies() - book.getTotalCopies();
        book.setTotalCopies(bookDetails.getTotalCopies());
        book.setAvailableCopies(book.getAvailableCopies() + diff);

        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // VERIFICARE: Nu stergem daca e imprumutata
        boolean isBorrowed = borrowRecordRepository.existsByUserAndBookAndStatus(null, book, BorrowRecord.BorrowStatus.BORROWED);
        // Nota: Metoda existsByUserAndBook... de mai sus asteapta un User.
        // Trebuie sa facem o mica modificare in Repo sau sa iteram.
        // Solutia mai simpla: Verificam daca exista vreun record BORROWED pentru cartea asta.

        // Voi folosi o logica simplificata aici, iterand prin recorduri (pentru un proiect mic e ok)
        boolean hasActiveLoans = borrowRecordRepository.findAll().stream()
                .anyMatch(r -> r.getBook().getId().equals(id) && r.getStatus() == BorrowRecord.BorrowStatus.BORROWED);

        if (hasActiveLoans) {
            throw new RuntimeException("Nu poti sterge cartea! Este imprumutata momentan.");
        }

        bookRepository.delete(book);
    }
}