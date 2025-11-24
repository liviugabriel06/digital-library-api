package com.example.digitallibrary.service;

import com.example.digitallibrary.model.Book;
import com.example.digitallibrary.model.BorrowRecord;
import com.example.digitallibrary.model.User;
import com.example.digitallibrary.repository.BookRepository;
import com.example.digitallibrary.repository.BorrowRecordRepository;
import com.example.digitallibrary.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BorrowService(BorrowRecordRepository borrowRecordRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BorrowRecord borrowBook(Long bookId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 1. Verificam stocul
        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Cartea nu mai este disponibila!");
        }

        // 2. Verificam daca userul o are deja
        boolean alreadyBorrowed = borrowRecordRepository.existsByUserAndBookAndStatus(user, book, BorrowRecord.BorrowStatus.BORROWED);
        if (alreadyBorrowed) {
            throw new RuntimeException("Ai imprumutat deja aceasta carte si nu ai returnat-o!");
        }

        // 3. Scadem stocul
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // 4. Cream inregistrarea
        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setBorrowDate(LocalDate.now());
        record.setStatus(BorrowRecord.BorrowStatus.BORROWED);

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord returnBook(Long borrowId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Imprumutul nu a fost gasit"));

        if (record.getStatus() == BorrowRecord.BorrowStatus.RETURNED) {
            throw new RuntimeException("Aceasta carte a fost deja returnata!");
        }

        Book book = record.getBook();

        // 1. Crestem stocul la loc
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // 2. Actualizam recordul
        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowRecord.BorrowStatus.RETURNED);

        return borrowRecordRepository.save(record);
    }

    public List<BorrowRecord> getUserHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return borrowRecordRepository.findByUser(user);
    }

    public List<BorrowRecord> getUserActiveLoans(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return borrowRecordRepository.findByUserAndStatus(user, BorrowRecord.BorrowStatus.BORROWED);
    }
}